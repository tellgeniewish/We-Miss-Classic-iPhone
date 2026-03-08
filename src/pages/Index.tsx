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
import iphoneImage from "@/assets/iphone-classic.png";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const { user, loading: authLoading, signOut } = useAuth();
  const [count, setCount] = useState<number | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      // 총 투표 수 조회
      const { count: voteCount } = await supabase
        .from("votes")
        .select("*", { count: "exact", head: true });
      setCount(voteCount ?? 0);

      // 로그인한 사용자의 투표 여부 확인
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

    const { error } = await supabase
      .from("votes")
      .insert({ user_id: user.id, fingerprint: user.id });

    if (error) {
      if (error.code === "23505") {
        setHasVoted(true);
        toast("이미 마음을 전하셨습니다");
      } else {
        toast("오류가 발생했습니다. 다시 시도해주세요.");
      }
      return;
    }

    setHasVoted(true);
    setCount((prev) => (prev ?? 0) + 1);
    toast("마음이 전해졌습니다 ❤️");
  };

  const handleLogout = async () => {
    await signOut();
    setHasVoted(false);
    toast("로그아웃되었습니다");
  };

  const shareUrl = typeof window !== "undefined" ? window.location.origin : "";
  const shareText = "우리는 클래식 아이폰이 그립습니다. 당신도 그렇다면 마음을 전해주세요.";

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast("링크가 복사되었습니다");
    } catch {
      toast("링크 복사에 실패했습니다");
    }
  };

  const handleShareTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
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
          title: "우리는 클래식 아이폰이 그립습니다",
          description: "홈 버튼, 하나의 카메라, 깔끔한 베젤… 그 시절의 아이폰을 그리워하는 마음을 모읍니다.",
          imageUrl: "https://id-preview--f0de4e5d-6d73-4f33-8b24-ebb601a9bb7c.lovable.app/placeholder.svg",
          link: { mobileWebUrl: shareUrl, webUrl: shareUrl },
        },
        buttons: [
          {
            title: "나도 그립습니다",
            link: { mobileWebUrl: shareUrl, webUrl: shareUrl },
          },
        ],
      });
    } catch (e) {
      console.error("Kakao Share error:", e);
      handleCopyLink();
      toast("카카오톡 공유 중 오류가 발생했습니다. 링크가 복사되었습니다.");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
          <span className="text-sm font-medium tracking-tight text-foreground">
            We Miss Classic iPhone
          </span>
          <div className="flex items-center gap-3">
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
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                로그인
              </button>
            )}
          </div>
        </div>
      </nav>

      <main className="pt-14 flex flex-col items-center justify-center min-h-screen px-6 sm:-mt-8">
        <div className="max-w-md w-full text-center animate-fade-in">
          <p className="text-xs text-muted-foreground mb-4 sm:mb-6 mt-4 sm:mt-0">
            Sometimes, simplicity was everything.
          </p>
          <div className="mb-4 sm:mb-8 flex justify-center">
            <img
              src={iphoneImage}
              alt="Classic iPhone with home button and Apple logo"
              className="w-36 sm:w-52 h-auto animate-slide-up dark:brightness-110 dark:contrast-110 drop-shadow-[0_20px_40px_rgba(0,0,0,0.15)] dark:drop-shadow-[0_20px_40px_rgba(255,255,255,0.08)]"
            />
          </div>

          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground mb-1 sm:mb-2">
            우리는 클래식 아이폰이 그립습니다
          </h1>
          <p className="text-[13px] text-muted-foreground mb-6 sm:mb-10 leading-relaxed">
            홈 버튼, 하나의 카메라, 깔끔한 일자 베젤, 하단의 이어폰 단자,<br />
            그리고 박스를 열면 들어있던 이어폰과 충전기까지.<br />
            그 시절의 아이폰을 그리워하는 사람들의 마음을 모읍니다.
          </p>

          <div className="mb-5 sm:mb-8">
            <div className="text-5xl sm:text-6xl font-light tracking-tight text-foreground animate-count-up">
              {isLoading || authLoading ? "···" : (count ?? 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1 sm:mt-2 tracking-wide uppercase">
              명이 그리워하고 있습니다
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
            {!user ? "로그인하고 마음 전하기" : hasVoted ? "이미 마음을 전했습니다" : "나도 그립습니다"}
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
                  공유하기
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="w-48 rounded-xl">
                <DropdownMenuItem onClick={handleCopyLink} className="gap-2 cursor-pointer">
                  <Link className="w-4 h-4" />
                  링크 복사
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleShareTwitter} className="gap-2 cursor-pointer">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  X (Twitter)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleShareKakao} className="gap-2 cursor-pointer">
                  <MessageCircle className="w-4 h-4" />
                  카카오톡
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

      </main>
    </div>
  );
};

export default Index;
