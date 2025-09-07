'use client';

import { useState, forwardRef } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Lock, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';

interface PasswordConfirmationInputProps {
  id: string;
  name: string;
  label: string;
  placeholder?: string;
  autoComplete?: string;
  required?: boolean;
  password: string;
  error?: string;
  className?: string;
  value?: string;
  onChange?: (value: string) => void;
}

const PasswordConfirmationInput = forwardRef<HTMLInputElement, PasswordConfirmationInputProps>(({
  id,
  name,
  label,
  placeholder = "Confirm your password",
  autoComplete = "new-password",
  required = false,
  password,
  error,
  className = "",
  value = "",
  onChange,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState(value);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setConfirmPassword(newValue);
    onChange?.(newValue);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const passwordsMatch = password && confirmPassword && password === confirmPassword;
  const hasMismatch = confirmPassword && password && password !== confirmPassword;

  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor={id} className="text-sm font-medium">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      
      <div className="relative">
        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          ref={ref}
          id={id}
          name={name}
          type={showPassword ? "text" : "password"}
          autoComplete={autoComplete}
          required={required}
          value={confirmPassword}
          onChange={handlePasswordChange}
          className={`pl-10 pr-10 ${
            error || hasMismatch
              ? 'border-red-500 focus:border-destructive focus:ring-destructive' 
              : passwordsMatch
              ? 'border-green-500 focus:border-green-500 focus:ring-green-500'
              : ''
          }`}
          placeholder={placeholder}
          {...props}
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
          onClick={togglePasswordVisibility}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4 text-muted-foreground" />
          ) : (
            <Eye className="h-4 w-4 text-muted-foreground" />
          )}
        </Button>
      </div>

      {/* Password Match Indicator */}
      {confirmPassword && (
        <div className="flex items-center space-x-1 text-sm">
          {passwordsMatch ? (
            <>
              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
              <span className="text-green-600">Passwords match</span>
            </>
          ) : hasMismatch ? (
            <>
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
              <span className="text-red-600">Passwords do not match</span>
            </>
          ) : null}
        </div>
      )}

      {error && (
        <div className="flex items-center space-x-1 text-sm text-destructive">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
});

PasswordConfirmationInput.displayName = 'PasswordConfirmationInput';

export default PasswordConfirmationInput;
