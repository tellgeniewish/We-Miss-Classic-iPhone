import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Heart, User, LogOut, Share2, Link, MessageCircle, Sun, Moon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/sonner";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import iphoneImage from "@/assets/iphone-classic.png";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useLocale } from "@/hooks/useLocale";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const MAX_REASON_LENGTH = 200;

const Index = () => {
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const { user, loading: authLoading, signOut } = useAuth();
  const { t } = useLocale();
  const [count, setCount] = useState<number | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showReasonDialog, setShowReasonDialog] = useState(false);
  const [reason, setReason] = useState("");
  const [voteId, setVoteId] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      const { count: voteCount } = await supabase
        .from("votes")
        .select("*", { count: "exact", head: true });
      setCount(voteCount ?? 0);

      if (user) {
        const { data } = await supabase
          .from("votes")
          .select("id")
          .eq("user_id", user.id)
          .maybeSingle();
        if (data) setHasVoted(true);
      }

      setIsLoading(false);
    };
    if (!authLoading) init();
  }, [user, authLoading]);

  const handleVote = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (hasVoted) return;

    const { data, error } = await supabase
      .from("votes")
      .insert({ user_id: user.id, fingerprint: user.id })
      .select("id")
      .single();

    if (error) {
      if (error.code === "23505") {
        setHasVoted(true);
        toast(t("toast.already_voted"));
      } else {
        toast(t("toast.error"));
      }
      return;
    }

    setHasVoted(true);
    setCount((prev) => (prev ?? 0) + 1);
    setVoteId(data.id);
    setShowReasonDialog(true);
  };

  const handleReasonSubmit = async () => {
    if (voteId && reason.trim()) {
      await supabase
        .from("votes")
        .update({ reason: reason.trim() } as any)
        .eq("id", voteId);
      toast(t("toast.reason_saved"));
    }
    setShowReasonDialog(false);
    setReason("");
    toast(t("toast.voted"));
  };

  const handleReasonSkip = () => {
    setShowReasonDialog(false);
    setReason("");
    toast(t("toast.voted"));
  };

  const handleLogout = async () => {
    await signOut();
    setHasVoted(false);
    toast(t("toast.logged_out"));
  };

  const shareUrl = typeof window !== "undefined" ? window.location.origin : "";

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast(t("toast.link_copied"));
    } catch {
      toast(t("toast.link_copy_fail"));
    }
  };

  const handleShareTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(t("index.title"))}&url=${encodeURIComponent(shareUrl)}`,
      "_blank"
    );
  };

  const loadKakaoSdk = (): Promise<any> => {
    return new Promise((resolve, reject) => {
      const Kakao = (window as any).Kakao;
      if (Kakao) {
        resolve(Kakao);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://t1.kakaocdn.net/kakao_js_sdk/2.7.4/kakao.min.js";
      script.onload = () => resolve((window as any).Kakao);
      script.onerror = () => reject(new Error("Failed to load Kakao SDK"));
      document.head.appendChild(script);
    });
  };

  const handleShareKakao = async () => {
    try {
      const Kakao = await loadKakaoSdk();
      if (!Kakao.isInitialized()) {
        Kakao.init("7f15b3566da4bdf39a5925e217aabeee");
      }
      Kakao.Share.sendDefault({
        objectType: "feed",
        content: {
          title: t("kakao.title"),
          description: t("kakao.desc"),
          imageUrl: "https://id-preview--f0de4e5d-6d73-4f33-8b24-ebb601a9bb7c.lovable.app/placeholder.svg",
          link: { mobileWebUrl: shareUrl, webUrl: shareUrl },
        },
        buttons: [
          {
            title: t("kakao.button"),
            link: { mobileWebUrl: shareUrl, webUrl: shareUrl },
          },
        ],
      });
    } catch (e) {
      console.error("Kakao Share error:", e);
      handleCopyLink();
      toast(t("toast.kakao_error"));
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
          <span className="text-sm font-medium tracking-tight text-foreground">
            We Miss Classic iPhone
          </span>
          <div className="flex items-center gap-1">
            <LanguageSwitcher />
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-full hover:bg-secondary transition-colors"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4 text-muted-foreground" />
              ) : (
                <Moon className="w-4 h-4 text-muted-foreground" />
              )}
            </button>
            {user ? (
              <>
                <button
                  onClick={() => navigate("/mypage")}
                  className="p-2 rounded-full hover:bg-secondary transition-colors"
                >
                  <User className="w-4 h-4 text-muted-foreground" />
                </button>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-full hover:bg-secondary transition-colors"
                >
                  <LogOut className="w-4 h-4 text-muted-foreground" />
                </button>
              </>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors pl-2"
              >
                {t("nav.login")}
              </button>
            )}
          </div>
        </div>
      </nav>

      <main className="pt-14 flex flex-col items-center justify-center min-h-screen px-6 sm:-mt-8">
        <div className="max-w-md w-full text-center animate-fade-in">
          <p className="text-xs text-muted-foreground mb-4 sm:mb-6 mt-4 sm:mt-0">
            {t("index.tagline")}
          </p>
          <div className="mb-4 sm:mb-8 flex justify-center">
            <img
              src={iphoneImage}
              alt="Classic iPhone with home button and Apple logo"
              className="w-36 sm:w-52 h-auto animate-slide-up dark:brightness-110 dark:contrast-110 drop-shadow-[0_20px_40px_rgba(0,0,0,0.15)] dark:drop-shadow-[0_20px_40px_rgba(255,255,255,0.08)]"
            />
          </div>

          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground mb-1 sm:mb-2">
            {t("index.title")}
          </h1>
          <p className="text-[13px] text-muted-foreground mb-6 sm:mb-10 leading-relaxed">
            {t("index.desc.line1")}<br />
            {t("index.desc.line2")}<br />
            {t("index.desc.line3")}
          </p>

          <div className="mb-5 sm:mb-8">
            <div className="text-5xl sm:text-6xl font-light tracking-tight text-foreground animate-count-up">
              {isLoading || authLoading ? "···" : (count ?? 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1 sm:mt-2 tracking-wide uppercase">
              {t("index.count_label")}
            </p>
          </div>

          <Button
            onClick={handleVote}
            disabled={hasVoted || (isLoading && !!user)}
            size="lg"
            className={`rounded-full px-10 h-12 text-sm font-medium transition-all duration-300 ${
              hasVoted
                ? "bg-secondary text-muted-foreground"
                : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/25"
            }`}
          >
            <Heart className={`w-4 h-4 mr-2 ${hasVoted ? "" : "fill-current"}`} />
            {!user ? t("index.vote_login") : hasVoted ? t("index.vote_done") : t("index.vote")}
          </Button>

          <div className="mt-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full text-xs text-muted-foreground hover:text-foreground gap-1.5"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  {t("index.share")}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="w-48 rounded-xl">
                <DropdownMenuItem onClick={handleCopyLink} className="gap-2 cursor-pointer">
                  <Link className="w-4 h-4" />
                  {t("index.copy_link")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleShareTwitter} className="gap-2 cursor-pointer">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  X (Twitter)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleShareKakao} className="gap-2 cursor-pointer">
                  <MessageCircle className="w-4 h-4" />
                  {t("index.kakao")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </main>

      <Dialog open={showReasonDialog} onOpenChange={(open) => {
        if (!open) handleReasonSkip();
      }}>
        <DialogContent className="rounded-2xl max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-base font-medium text-foreground">
              {t("reason.title")}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Textarea
              value={reason}
              onChange={(e) => {
                if (e.target.value.length <= MAX_REASON_LENGTH) {
                  setReason(e.target.value);
                }
              }}
              placeholder={t("reason.placeholder")}
              className="resize-none h-28 text-sm"
            />
            <p className="text-xs text-muted-foreground text-right">
              {reason.length}{t("reason.char_count")}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleReasonSkip}
                className="flex-1 rounded-lg text-sm"
              >
                {t("reason.skip")}
              </Button>
              <Button
                onClick={handleReasonSubmit}
                className="flex-1 rounded-lg text-sm bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {t("reason.submit")}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
