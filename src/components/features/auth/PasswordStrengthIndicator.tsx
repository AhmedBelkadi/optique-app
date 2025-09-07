'use client';

import { useState, useEffect } from 'react';
import { Check, X, Eye, EyeOff } from 'lucide-react';

interface PasswordStrengthIndicatorProps {
  password: string;
  showPassword?: boolean;
  onToggleShowPassword?: () => void;
  className?: string;
}

interface PasswordRequirement {
  id: string;
  label: string;
  test: (password: string) => boolean;
  icon: React.ReactNode;
}

const requirements: PasswordRequirement[] = [
  {
    id: 'length',
    label: 'At least 12 characters',
    test: (password) => password.length >= 12,
    icon: <span className="text-lg">📏</span>
  },
  {
    id: 'uppercase',
    label: 'Contains uppercase letter',
    test: (password) => /[A-Z]/.test(password),
    icon: <span className="text-lg">🔤</span>
  },
  {
    id: 'lowercase',
    label: 'Contains lowercase letter',
    test: (password) => /[a-z]/.test(password),
    icon: <span className="text-lg">🔡</span>
  },
  {
    id: 'number',
    label: 'Contains number',
    test: (password) => /[0-9]/.test(password),
    icon: <span className="text-lg">🔢</span>
  },
  {
    id: 'special',
    label: 'Contains special character',
    test: (password) => /[^A-Za-z0-9]/.test(password),
    icon: <span className="text-lg">🔣</span>
  }
];

export default function PasswordStrengthIndicator({ 
  password, 
  showPassword = false, 
  onToggleShowPassword,
  className = ""
}: PasswordStrengthIndicatorProps) {
  const [strength, setStrength] = useState(0);
  const [strengthLabel, setStrengthLabel] = useState('');
  const [strengthColor, setStrengthColor] = useState('');

  useEffect(() => {
    const validRequirements = requirements.filter(req => req.test(password));
    const strengthPercentage = (validRequirements.length / requirements.length) * 100;
    
    setStrength(strengthPercentage);

    if (strengthPercentage === 0) {
      setStrengthLabel('Very Weak');
      setStrengthColor('bg-red-500');
    } else if (strengthPercentage <= 40) {
      setStrengthLabel('Weak');
      setStrengthColor('bg-orange-500');
    } else if (strengthPercentage <= 60) {
      setStrengthLabel('Fair');
      setStrengthColor('bg-yellow-500');
    } else if (strengthPercentage <= 80) {
      setStrengthLabel('Good');
      setStrengthColor('bg-blue-500');
    } else {
      setStrengthLabel('Strong');
      setStrengthColor('bg-green-500');
    }
  }, [password]);

  const isPasswordValid = requirements.every(req => req.test(password));

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Password Strength Bar */}
      {password && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Password Strength:</span>
            <span className={`font-medium ${
              strength === 0 ? 'text-red-500' :
              strength <= 40 ? 'text-orange-500' :
              strength <= 60 ? 'text-yellow-500' :
              strength <= 80 ? 'text-blue-500' :
              'text-green-500'
            }`}>
              {strengthLabel}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${strengthColor}`}
              style={{ width: `${strength}%` }}
            />
          </div>
        </div>
      )}

      {/* Requirements Checklist */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">Requirements:</p>
        <div className="grid grid-cols-1 gap-2">
          {requirements.map((requirement) => {
            const isValid = requirement.test(password);
            return (
              <div 
                key={requirement.id}
                className={`flex items-center space-x-2 text-sm transition-colors duration-200 ${
                  isValid ? 'text-green-600' : 'text-gray-500'
                }`}
              >
                <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                  isValid ? 'bg-green-100' : 'bg-gray-100'
                }`}>
                  {isValid ? (
                    <Check className="w-3 h-3 text-green-600" />
                  ) : (
                    <X className="w-3 h-3 text-gray-400" />
                  )}
                </div>
                <span className="flex items-center space-x-2">
                  {requirement.icon}
                  <span className={isValid ? 'line-through opacity-60' : ''}>
                    {requirement.label}
                  </span>
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Password Preview */}
      {password && onToggleShowPassword && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-muted-foreground">Preview:</span>
              <span className={`font-mono text-sm ${
                showPassword ? 'text-gray-900' : 'text-gray-500'
              }`}>
                {showPassword ? password : '•'.repeat(password.length)}
              </span>
            </div>
            <button
              type="button"
              onClick={onToggleShowPassword}
              className="text-muted-foreground hover:text-gray-900 transition-colors"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      )}

      {/* Success Message */}
      {isPasswordValid && password && (
        <div className="flex items-center space-x-2 p-3 bg-green-50 border border-green-200 rounded-lg">
          <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
          <span className="text-sm text-green-700 font-medium">
            Great! Your password meets all security requirements.
          </span>
        </div>
      )}
    </div>
  );
}
