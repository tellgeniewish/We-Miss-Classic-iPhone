import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart, User, LogOut, Share2, Link, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import iphoneImage from "@/assets/iphone-classic.png";

const Index = () => {
  const navigate = useNavigate();
  const [count] = useState(1247);
  const [hasVoted, setHasVoted] = useState(false);
  const [isLoggedIn] = useState(true);

  const handleVote = () => {
    if (!hasVoted) {
      setHasVoted(true);
    }
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
    // 카카오 SDK 미연동 상태에서는 URL 복사로 대체
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
              className="w-48 h-auto drop-shadow-2xl animate-slide-up"
            />
          </div>

          {/* 타이틀 */}
          <h1 className="text-2xl font-semibold tracking-tight text-foreground mb-2">
            우리는 클래식 아이폰이 그립습니다
          </h1>
          <p className="text-sm text-muted-foreground mb-10 leading-relaxed">
            홈 버튼, 하나의 카메라, 깔끔한 일자 베젤.<br />
            그 시절의 아이폰을 그리워하는 사람들의 마음을 모읍니다.
          </p>

          {/* 카운터 */}
          <div className="mb-8">
            <div className="text-6xl font-light tracking-tight text-foreground animate-count-up">
              {(hasVoted ? count + 1 : count).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-2 tracking-wide uppercase">
              명이 그리워하고 있습니다
            </p>
          </div>

          {/* 공감 버튼 */}
          <Button
            onClick={handleVote}
            disabled={hasVoted}
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

          {!isLoggedIn && (
            <p className="text-xs text-muted-foreground mt-4">
              마음을 전하려면{" "}
              <button
                onClick={() => navigate("/login")}
                className="text-primary hover:underline"
              >
                로그인
              </button>
              이 필요합니다
            </p>
          )}
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
