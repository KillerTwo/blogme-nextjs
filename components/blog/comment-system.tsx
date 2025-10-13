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
import type { Comment } from '@/lib/types';

interface CommentSystemProps {
  postId: number;
  comments: Comment[];
}

interface CommentFormProps {
  postId: number;
  parentId?: number;
  onSubmit: (comment: Partial<Comment>) => void;
  onCancel?: () => void;
  placeholder?: string;
}

function CommentForm({ postId, parentId, onSubmit, onCancel, placeholder = "写下你的评论..." }: CommentFormProps) {
  const [formData, setFormData] = useState({
    author: '',
    email: '',
    content: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newComment: Partial<Comment> = {
      postId,
      parentId,
      author: formData.author,
      email: formData.email,
      content: formData.content,
      createdAt: new Date().toISOString(),
    };

    onSubmit(newComment);
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
            <label className="block text-sm font-medium mb-1">评论内容 *</label>
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
              {parentId ? '发表回复' : '发表评论'}
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

interface CommentItemProps {
  comment: Comment;
  depth?: number;
  onReply: (commentId: number) => void;
  replyingTo: number | null;
  onSubmitReply: (comment: Partial<Comment>) => void;
  onCancelReply: () => void;
}

function CommentItem({ 
  comment, 
  depth = 0, 
  onReply, 
  replyingTo, 
  onSubmitReply, 
  onCancelReply 
}: CommentItemProps) {
  const formattedDate = format(new Date(comment.createdAt), 'yyyy年MM月dd日 HH:mm', { locale: zhCN });
  const isReplying = replyingTo === comment.id;

  return (
    <div className={depth > 0 ? 'ml-8 mt-4' : ''}>
      <Card className={depth > 0 ? 'border-l-4 border-l-blue-200' : ''}>
        <CardContent className="pt-6">
          <div className="flex items-start space-x-4">
            <Avatar className="h-10 w-10">
              <AvatarImage 
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.author}`} 
                alt={comment.author} 
              />
              <AvatarFallback>{comment.author.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <span className="font-semibold">{comment.author}</span>
                <span className="text-sm text-gray-500">{formattedDate}</span>
              </div>
              <p className="text-gray-700 mb-3 whitespace-pre-wrap">{comment.content}</p>
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onReply(comment.id)}
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
          <CommentForm
            postId={comment.postId}
            parentId={comment.id}
            onSubmit={onSubmitReply}
            onCancel={onCancelReply}
            placeholder={`回复 @${comment.author}...`}
          />
        </div>
      )}

      {/* 渲染子评论 */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-4">
          {comment.replies.map(reply => (
            <CommentItem
              key={reply.id}
              comment={reply}
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

export function CommentSystem({ postId, comments: initialComments }: CommentSystemProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [replyingTo, setReplyingTo] = useState<number | null>(null);

  const handleNewComment = (newComment: Partial<Comment>) => {
    const comment: Comment = {
      id: Date.now(), // 简单的ID生成，实际应用中应该使用后端生成的ID
      postId: newComment.postId!,
      author: newComment.author!,
      email: newComment.email!,
      content: newComment.content!,
      createdAt: newComment.createdAt!,
      parentId: newComment.parentId,
      replies: []
    };

    if (comment.parentId) {
      // 添加回复
      const addReplyToComment = (commentList: Comment[]): Comment[] => {
        return commentList.map(c => {
          if (c.id === comment.parentId) {
            return {
              ...c,
              replies: [...(c.replies || []), comment]
            };
          } else if (c.replies && c.replies.length > 0) {
            return {
              ...c,
              replies: addReplyToComment(c.replies)
            };
          }
          return c;
        });
      };
      setComments(addReplyToComment(comments));
    } else {
      // 添加顶级评论
      setComments([...comments, comment]);
    }

    setReplyingTo(null);
  };

  const handleReply = (commentId: number) => {
    setReplyingTo(commentId === replyingTo ? null : commentId);
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
  };

  return (
    <div className="space-y-6">
      {/* 评论统计 */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold flex items-center">
          <MessageSquare className="h-5 w-5 mr-2" />
          评论 ({comments.length})
        </h3>
      </div>

      {/* 发表评论表单 */}
      <CommentForm
        postId={postId}
        onSubmit={handleNewComment}
      />

      <Separator />

      {/* 评论列表 */}
      {comments.length > 0 ? (
        <div className="space-y-6">
          {comments.map(comment => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onReply={handleReply}
              replyingTo={replyingTo}
              onSubmitReply={handleNewComment}
              onCancelReply={handleCancelReply}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>暂无评论，快来抢沙发吧！</p>
        </div>
      )}
    </div>
  );
}