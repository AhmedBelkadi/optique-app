'use client';

import { useState, forwardRef } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import PasswordStrengthIndicator from './PasswordStrengthIndicator';

interface PasswordInputProps {
  id: string;
  name: string;
  label: string;
  placeholder?: string;
  autoComplete?: string;
  required?: boolean;
  showStrengthIndicator?: boolean;
  showPreview?: boolean;
  error?: string;
  className?: string;
  value?: string;
  onChange?: (value: string) => void;
}

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(({
  id,
  name,
  label,
  placeholder = "Enter your password",
  autoComplete = "current-password",
  required = false,
  showStrengthIndicator = false,
  showPreview = false,
  error,
  className = "",
  value = "",
  onChange,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState(value);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setPassword(newValue);
    onChange?.(newValue);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

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
          value={password}
          onChange={handlePasswordChange}
          className={`pl-10 pr-10 ${
            error 
              ? 'border-red-500 focus:border-destructive focus:ring-destructive' 
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

      {error && (
        <div className="flex items-center space-x-1 text-sm text-destructive">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {showStrengthIndicator && password && (
        <PasswordStrengthIndicator 
          password={password}
          showPassword={showPassword}
          onToggleShowPassword={togglePasswordVisibility}
        />
      )}
    </div>
  );
});

PasswordInput.displayName = 'PasswordInput';

export default PasswordInput;
