import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Heart, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
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
  const { user, loading, signOut } = useAuth();
  const [vote, setVote] = useState<{ created_at: string } | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
      return;
    }
    if (user) {
      supabase
        .from("votes")
        .select("created_at")
        .eq("user_id", user.id)
        .maybeSingle()
        .then(({ data }) => setVote(data));
    }
  }, [user, loading, navigate]);

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    // Delete vote first (if exists), then sign out
    await supabase.from("votes").delete().eq("user_id", user.id);
    await signOut();
    toast("탈퇴가 완료되었습니다");
    navigate("/");
  };

  if (loading || !user) return null;

  return (
    <div className="min-h-screen bg-background">
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
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-3">
            <span className="text-2xl">👤</span>
          </div>
          <h2 className="text-lg font-medium text-foreground">
            {user.user_metadata?.full_name || "사용자"}
          </h2>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>

        <Separator className="mb-6" />

        {vote ? (
          <div className="bg-card rounded-xl p-5 mb-6 border border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Heart className="w-4 h-4 text-primary fill-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">마음을 전했습니다</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(vote.created_at).toLocaleDateString("ko-KR")}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-card rounded-xl p-5 mb-6 border border-border text-center">
            <p className="text-sm text-muted-foreground">아직 투표하지 않았습니다</p>
          </div>
        )}

        <div className="space-y-1 mb-10">
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-3 rounded-lg hover:bg-secondary transition-colors text-sm text-foreground"
          >
            로그아웃
          </button>
        </div>

        <Separator className="mb-6" />

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
              <AlertDialogAction
                onClick={handleDeleteAccount}
                className="rounded-lg text-sm bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
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
