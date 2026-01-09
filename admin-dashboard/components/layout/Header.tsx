'use client';

import { Bell, Search, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function Header() {
  return (
    <header className="h-16 border-b border-gray-200 bg-white/80 backdrop-blur-sm flex items-center justify-between px-6 shadow-sm">
      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="search"
            placeholder="搜索健康数据..."
            className="pl-10 bg-primary-50/50 border-primary-200 focus:border-primary-500 focus:ring-primary-500 focus:bg-white transition-colors"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative hover:bg-primary-100 transition-colors">
          <Bell className="w-5 h-5 text-gray-700" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-danger rounded-full animate-pulse"></span>
        </Button>

        {/* User Avatar */}
        <Avatar className="w-9 h-9 cursor-pointer hover:ring-2 hover:ring-primary-500 transition-all ring-offset-2">
          <AvatarImage src="/images/avatar.jpg" />
          <AvatarFallback className="bg-gradient-to-br from-primary-500 to-primary-600 text-white font-semibold">
            U
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
