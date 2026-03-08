import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      toast(error.message);
    } else {
      setSent(true);
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="w-full max-w-sm animate-fade-in">
        <button
          onClick={() => navigate("/login")}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          로그인으로 돌아가기
        </button>

        <h1 className="text-xl font-semibold tracking-tight text-foreground mb-2">
          비밀번호 재설정
        </h1>

        {sent ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              <span className="font-medium text-foreground">{email}</span>으로
              비밀번호 재설정 링크를 보냈습니다. 이메일을 확인해주세요.
            </p>
            <Button
              variant="outline"
              className="w-full h-11 rounded-lg text-sm"
              onClick={() => navigate("/login")}
            >
              로그인으로 돌아가기
            </Button>
          </div>
        ) : (
          <>
            <p className="text-sm text-muted-foreground mb-6">
              가입한 이메일을 입력하면 비밀번호 재설정 링크를 보내드립니다.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs text-muted-foreground">
                  이메일
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 rounded-lg text-sm"
                  placeholder="hello@example.com"
                  required
                />
              </div>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 rounded-lg text-sm font-medium"
              >
                {isLoading ? "전송 중..." : "재설정 링크 보내기"}
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
