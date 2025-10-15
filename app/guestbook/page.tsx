"use client";

import { useState } from 'react';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { MessageSquare, Reply, Send, ThumbsUp } from 'lucide-react';
import { guestbooks as initialGuestbooks } from '@/lib/data';
import type { Guestbook } from '@/lib/types';
import ContentLayout from "@/components/layout/content-layout";

interface GuestbookFormProps {
  parentId?: number;
  onSubmit: (guestbook: Partial<Guestbook>) => void;
  onCancel?: () => void;
  placeholder?: string;
}

function GuestbookForm({ parentId, onSubmit, onCancel, placeholder = "请输入您想说的话..." }: GuestbookFormProps) {
  const [formData, setFormData] = useState({
    author: '',
    email: '',
    content: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newGuestbook: Partial<Guestbook> = {
      parentId,
      author: formData.author,
      email: formData.email,
      content: formData.content,
      createdAt: new Date().toISOString(),
    };

    onSubmit(newGuestbook);
    setFormData({ author: '', email: '', content: '' });
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">昵称 *</label>
              <Input
                required
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                placeholder="请输入您的昵称"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">邮箱 *</label>
              <Input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="请输入您的邮箱"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">留言内容 *</label>
            <Textarea
              required
              rows={4}
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder={placeholder}
            />
          </div>
          <div className="flex space-x-2">
            <Button type="submit" className="flex items-center">
              <Send className="h-4 w-4 mr-2" />
              {parentId ? '发表回复' : '发表留言'}
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                取消
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

interface GuestbookItemProps {
  guestbook: Guestbook;
  depth?: number;
  onReply: (guestbookId: number) => void;
  replyingTo: number | null;
  onSubmitReply: (guestbook: Partial<Guestbook>) => void;
  onCancelReply: () => void;
}

function GuestbookItem({ 
  guestbook, 
  depth = 0, 
  onReply, 
  replyingTo, 
  onSubmitReply, 
  onCancelReply 
}: GuestbookItemProps) {
  const formattedDate = format(new Date(guestbook.createdAt), 'yyyy年MM月dd日 HH:mm', { locale: zhCN });
  const isReplying = replyingTo === guestbook.id;

  return (
    <div className={depth > 0 ? 'ml-8 mt-4' : ''}>
      <Card className={depth > 0 ? 'border-l-4 border-l-blue-200' : ''}>
        <CardContent className="pt-6">
          <div className="flex items-start space-x-4">
            <Avatar className="h-10 w-10">
              <AvatarImage 
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${guestbook.author}`} 
                alt={guestbook.author} 
              />
              <AvatarFallback>{guestbook.author.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <span className="font-semibold">{guestbook.author}</span>
                <span className="text-sm text-gray-500">{formattedDate}</span>
              </div>
              <p className="text-gray-700 mb-3 whitespace-pre-wrap">{guestbook.content}</p>
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onReply(guestbook.id)}
                  className="text-blue-600 hover:text-blue-700"
                >
                  <Reply className="h-4 w-4 mr-1" />
                  回复
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-500 hover:text-gray-600"
                >
                  <ThumbsUp className="h-4 w-4 mr-1" />
                  点赞
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 回复表单 */}
      {isReplying && (
        <div className="mt-4">
          <GuestbookForm
            parentId={guestbook.id}
            onSubmit={onSubmitReply}
            onCancel={onCancelReply}
            placeholder={`回复 @${guestbook.author}...`}
          />
        </div>
      )}

      {/* 渲染子留言 */}
      {guestbook.replies && guestbook.replies.length > 0 && (
        <div className="mt-4">
          {guestbook.replies.map(reply => (
            <GuestbookItem
              key={reply.id}
              guestbook={reply}
              depth={depth + 1}
              onReply={onReply}
              replyingTo={replyingTo}
              onSubmitReply={onSubmitReply}
              onCancelReply={onCancelReply}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function GuestbookPage() {
  const [guestbooks, setGuestbooks] = useState<Guestbook[]>(initialGuestbooks);
  const [replyingTo, setReplyingTo] = useState<number | null>(null);

  const handleNewGuestbook = (newGuestbook: Partial<Guestbook>) => {
    const guestbook: Guestbook = {
      id: Date.now(), // 简单的ID生成，实际应用中应该使用后端生成的ID
      author: newGuestbook.author!,
      email: newGuestbook.email!,
      content: newGuestbook.content!,
      createdAt: newGuestbook.createdAt!,
      parentId: newGuestbook.parentId,
      replies: []
    };

    if (guestbook.parentId) {
      // 添加回复
      const addReplyToGuestbook = (guestbookList: Guestbook[]): Guestbook[] => {
        return guestbookList.map(g => {
          if (g.id === guestbook.parentId) {
            return {
              ...g,
              replies: [...(g.replies || []), guestbook]
            };
          } else if (g.replies && g.replies.length > 0) {
            return {
              ...g,
              replies: addReplyToGuestbook(g.replies)
            };
          }
          return g;
        });
      };
      setGuestbooks(addReplyToGuestbook(guestbooks));
    } else {
      // 添加顶级留言
      setGuestbooks([...guestbooks, guestbook]);
    }

    setReplyingTo(null);
  };

  const handleReply = (guestbookId: number) => {
    setReplyingTo(guestbookId === replyingTo ? null : guestbookId);
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
  };

  return (
      <ContentLayout>
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="flex items-center mb-8">
              <MessageSquare className="h-8 w-8 mr-3 text-blue-600" />
              <h1 className="text-3xl font-bold">留言板</h1>
            </div>

            <div className="mb-8 p-4 bg-blue-50 rounded-lg">
              <p className="text-gray-700">
                欢迎在这里留言交流！请保持友善，共同维护良好的交流环境。
                您的每一条留言我都会认真阅读并回复。
              </p>
            </div>

            <div className="space-y-6">
              {/* 留言统计 */}
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2" />
                  留言 ({guestbooks.length})
                </h3>
              </div>

              {/* 发表留言表单 */}
              <GuestbookForm onSubmit={handleNewGuestbook} />

              <Separator />

              {/* 留言列表 */}
              {guestbooks.length > 0 ? (
                <div className="space-y-6">
                  {guestbooks.map(guestbook => (
                    <GuestbookItem
                      key={guestbook.id}
                      guestbook={guestbook}
                      onReply={handleReply}
                      replyingTo={replyingTo}
                      onSubmitReply={handleNewGuestbook}
                      onCancelReply={handleCancelReply}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>暂无留言，快来抢沙发吧！</p>
                </div>
              )}
            </div>
          </div>
      </ContentLayout>

  );
}