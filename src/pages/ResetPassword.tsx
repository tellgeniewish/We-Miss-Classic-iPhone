import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { useLocale } from "@/hooks/useLocale";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { t } = useLocale();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes("type=recovery")) {
      setIsValid(true);
    } else {
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
      toast(t("toast.pw_mismatch"));
      return;
    }

    if (password.length < 6) {
      toast(t("toast.pw_min"));
      return;
    }

    setIsLoading(true);

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      toast(error.message);
    } else {
      toast(t("toast.pw_changed"));
      navigate("/");
    }

    setIsLoading(false);
  };

  if (!isValid) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="w-full max-w-sm text-center animate-fade-in">
          <p className="text-sm text-muted-foreground mb-4">
            {t("reset.invalid")}
          </p>
          <Button
            variant="outline"
            className="rounded-lg text-sm"
            onClick={() => navigate("/forgot-password")}
          >
            {t("reset.request")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="w-full max-w-sm animate-fade-in">
        <h1 className="text-xl font-semibold tracking-tight text-foreground mb-2">
          {t("reset.title")}
        </h1>
        <p className="text-sm text-muted-foreground mb-6">
          {t("reset.desc")}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password" className="text-xs text-muted-foreground">
              {t("reset.new_pw")}
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
              {t("reset.confirm_pw")}
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
            {isLoading ? t("reset.loading") : t("reset.submit")}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
