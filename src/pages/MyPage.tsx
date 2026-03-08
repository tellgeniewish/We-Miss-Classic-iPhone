import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Heart, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const MyPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* 네비게이션 */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center">
          <button
            onClick={() => navigate("/")}
            className="p-2 -ml-2 rounded-full hover:bg-secondary transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-foreground" />
          </button>
          <span className="ml-3 text-sm font-medium text-foreground">마이페이지</span>
        </div>
      </nav>

      <main className="pt-14 max-w-md mx-auto px-6 py-10 animate-fade-in">
        {/* 프로필 */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-3">
            <span className="text-2xl">👤</span>
          </div>
          <h2 className="text-lg font-medium text-foreground">사용자</h2>
          <p className="text-sm text-muted-foreground">user@example.com</p>
        </div>

        <Separator className="mb-6" />

        {/* 투표 상태 */}
        <div className="bg-card rounded-xl p-5 mb-6 border border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Heart className="w-4 h-4 text-primary fill-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">마음을 전했습니다</p>
              <p className="text-xs text-muted-foreground">2024년 3월 8일</p>
            </div>
          </div>
        </div>

        {/* 메뉴 */}
        <div className="space-y-1 mb-10">
          <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-secondary transition-colors text-sm text-foreground">
            비밀번호 변경
          </button>
          <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-secondary transition-colors text-sm text-foreground">
            로그아웃
          </button>
        </div>

        <Separator className="mb-6" />

        {/* 탈퇴 */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              className="w-full text-destructive hover:text-destructive hover:bg-destructive/10 text-sm"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              회원 탈퇴
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="rounded-2xl max-w-sm">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-base">정말 탈퇴하시겠습니까?</AlertDialogTitle>
              <AlertDialogDescription className="text-sm">
                탈퇴하시면 투표 기록이 삭제되고 집계에서 차감됩니다.
                이 작업은 되돌릴 수 없습니다.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="rounded-lg text-sm">취소</AlertDialogCancel>
              <AlertDialogAction className="rounded-lg text-sm bg-destructive text-destructive-foreground hover:bg-destructive/90">
                탈퇴하기
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <p className="text-center text-xs text-muted-foreground mt-8">
          탈퇴 시 집계 수가 1 차감됩니다
        </p>
      </main>
    </div>
  );
};

export default MyPage;
