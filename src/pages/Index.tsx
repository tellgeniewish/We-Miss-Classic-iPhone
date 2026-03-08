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
import FingerprintJS from "@fingerprintjs/fingerprintjs";

const Index = () => {
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const [count, setCount] = useState<number | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [fingerprint, setFingerprint] = useState<string | null>(null);

  // 핑거프린트 초기화 및 투표 수 로드
  useEffect(() => {
    const init = async () => {
      // 핑거프린트 생성
      const fp = await FingerprintJS.load();
      const result = await fp.get();
      const visitorId = result.visitorId;
      setFingerprint(visitorId);

      // 총 투표 수 조회
      const { count: voteCount } = await supabase
        .from("votes")
        .select("*", { count: "exact", head: true });
      setCount(voteCount ?? 0);

      // 이미 투표했는지 확인
      const { data } = await supabase
        .from("votes")
        .select("id")
        .eq("fingerprint", visitorId)
        .maybeSingle();
      if (data) setHasVoted(true);

      setIsLoading(false);
    };
    init();
  }, []);

  const handleVote = async () => {
    if (!fingerprint || hasVoted) return;

    const { error } = await supabase
      .from("votes")
      .insert({ fingerprint });

    if (error) {
      if (error.code === "23505") {
        // unique violation — already voted
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

  const handleShareKakao = () => {
    handleCopyLink();
    toast("카카오톡 공유는 준비 중입니다. 링크가 복사되었습니다.");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* 네비게이션 */}
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
            <button
              onClick={() => navigate("/mypage")}
              className="p-2 rounded-full hover:bg-secondary transition-colors"
            >
              <User className="w-4 h-4 text-muted-foreground" />
            </button>
            <button className="p-2 rounded-full hover:bg-secondary transition-colors">
              <LogOut className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </div>
      </nav>

      {/* 메인 콘텐츠 */}
      <main className="pt-14 flex flex-col items-center justify-center min-h-screen px-6">
        <div className="max-w-md w-full text-center animate-fade-in">
          {/* 아이폰 이미지 */}
          <div className="mb-8 flex justify-center">
            <img
              src={iphoneImage}
              alt="Classic iPhone with home button and Apple logo"
              className="w-52 h-auto animate-slide-up dark:brightness-110 dark:contrast-110 drop-shadow-[0_20px_40px_rgba(0,0,0,0.15)] dark:drop-shadow-[0_20px_40px_rgba(255,255,255,0.08)]"
            />
          </div>

          {/* 타이틀 */}
          <h1 className="text-2xl font-semibold tracking-tight text-foreground mb-2">
            우리는 클래식 아이폰이 그립습니다
          </h1>
          <p className="text-sm text-muted-foreground mb-10 leading-relaxed">
            홈 버튼, 하나의 카메라, 깔끔한 일자 베젤,<br />
            그리고 박스를 열면 들어있던 이어폰까지.<br />
            그 시절의 아이폰을 그리워하는 사람들의 마음을 모읍니다.
          </p>

          {/* 카운터 */}
          <div className="mb-8">
            <div className="text-6xl font-light tracking-tight text-foreground animate-count-up">
              {isLoading ? "···" : (count ?? 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-2 tracking-wide uppercase">
              명이 그리워하고 있습니다
            </p>
          </div>

          {/* 공감 버튼 */}
          <Button
            onClick={handleVote}
            disabled={hasVoted || isLoading}
            size="lg"
            className={`rounded-full px-10 h-12 text-sm font-medium transition-all duration-300 ${
              hasVoted
                ? "bg-secondary text-muted-foreground"
                : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/25"
            }`}
          >
            <Heart className={`w-4 h-4 mr-2 ${hasVoted ? "" : "fill-current"}`} />
            {hasVoted ? "이미 마음을 전했습니다" : "나도 그립습니다"}
          </Button>

          {/* 공유 버튼 */}
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

        {/* 하단 */}
        <footer className="absolute bottom-6 text-xs text-muted-foreground">
          Sometimes, simplicity was everything.
        </footer>
      </main>
    </div>
  );
};

export default Index;
