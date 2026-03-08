import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    // Check for recovery token in URL hash
    const hash = window.location.hash;
    if (hash.includes("type=recovery")) {
      setIsValid(true);
    } else {
      // Also listen for auth state change with recovery event
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
        if (event === "PASSWORD_RECOVERY") {
          setIsValid(true);
        }
      });
      return () => subscription.unsubscribe();
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast("비밀번호가 일치하지 않습니다");
      return;
    }

    if (password.length < 6) {
      toast("비밀번호는 6자 이상이어야 합니다");
      return;
    }

    setIsLoading(true);

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      toast(error.message);
    } else {
      toast("비밀번호가 변경되었습니다");
      navigate("/");
    }

    setIsLoading(false);
  };

  if (!isValid) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="w-full max-w-sm text-center animate-fade-in">
          <p className="text-sm text-muted-foreground mb-4">
            유효하지 않은 링크입니다. 비밀번호 재설정을 다시 요청해주세요.
          </p>
          <Button
            variant="outline"
            className="rounded-lg text-sm"
            onClick={() => navigate("/forgot-password")}
          >
            비밀번호 재설정 요청
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="w-full max-w-sm animate-fade-in">
        <h1 className="text-xl font-semibold tracking-tight text-foreground mb-2">
          새 비밀번호 설정
        </h1>
        <p className="text-sm text-muted-foreground mb-6">
          새로운 비밀번호를 입력해주세요.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password" className="text-xs text-muted-foreground">
              새 비밀번호
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-11 rounded-lg text-sm"
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm" className="text-xs text-muted-foreground">
              비밀번호 확인
            </Label>
            <Input
              id="confirm"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="h-11 rounded-lg text-sm"
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 rounded-lg text-sm font-medium"
          >
            {isLoading ? "변경 중..." : "비밀번호 변경"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
