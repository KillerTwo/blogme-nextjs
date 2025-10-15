"use client";

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { TreeSelect } from '@/components/ui/tree-select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Upload, Plus, FileText, Settings2, Tag, Image as ImageIcon, Search } from 'lucide-react';
import { categories } from '@/lib/data';

// 动态导入MD编辑器以避免SSR问题
const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

interface CreatePostDialogProps {
  children: React.ReactNode;
}

export function CreatePostDialog({ children }: CreatePostDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    category: '',
    title: '',
    content: '',
    summary: '',
    tags: '',
    coverImage: '',
    seoDescription: '',
    showTopPreview: false,
  });
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);

  // 重置表单数据
  const resetFormData = () => {
    setFormData({
      category: '',
      title: '',
      content: '',
      summary: '',
      tags: '',
      coverImage: '',
      seoDescription: '',
      showTopPreview: false,
    });
    setCoverImagePreview(null);
  };

  // 处理弹框打开/关闭时的布局跳动
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    
    if (typeof document !== 'undefined') {
      const body = document.body;
      if (newOpen) {
        // 记录当前滚动位置和样式
        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
        body.style.paddingRight = '0px';
        body.style.overflow = 'hidden';
        // 立即恢复滚动条
        requestAnimationFrame(() => {
          body.style.overflow = 'scroll';
        });
      } else {
        // 关闭时清空表单数据
        resetFormData();
        // 延迟清理，确保动画完成
        setTimeout(() => {
          body.style.removeProperty('padding-right');
          body.style.removeProperty('overflow');
        }, 150);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('发布博客:', formData);
    // 这里应该调用 API 发布博客
    handleOpenChange(false);
    // 表单会在 handleOpenChange 中自动重置
  };

  const parseTags = () => {
    return formData.tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);
  };

  const removeTag = (tagToRemove: string) => {
    const newTags = parseTags().filter(tag => tag !== tagToRemove);
    setFormData({ ...formData, tags: newTags.join(', ') });
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // 检查文件类型
      if (!file.type.startsWith('image/')) {
        alert('请选择图片文件');
        return;
      }
      
      // 检查文件大小（限制为 5MB）
      if (file.size > 5 * 1024 * 1024) {
        alert('图片大小不能超过 5MB');
        return;
      }

      // 创建预览URL
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setCoverImagePreview(imageUrl);
        setFormData({ ...formData, coverImage: file.name });
      };
      reader.readAsDataURL(file);
    }
  };

  const clearCoverImage = () => {
    setCoverImagePreview(null);
    setFormData({ ...formData, coverImage: '' });
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="!max-w-7xl !max-h-[90vh] !p-0 flex flex-col overflow-hidden" showCloseButton={false}>
        {/* 美化的头部 */}
        <DialogHeader className="px-6 py-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <DialogTitle className="text-xl font-semibold text-gray-900">
                  创建新文章
                </DialogTitle>
                <p className="text-sm text-gray-500 mt-1">
                  填写文章信息并发布到您的博客
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleOpenChange(false)}
              className="h-8 w-8 hover:bg-white/50"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        {/* 主要内容区域 */}
        <div className="flex-1 overflow-y-auto create-post-dialog">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* 基本信息卡片 */}
              <Card className="shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg flex items-center">
                    <Settings2 className="h-4 w-4 mr-2" />
                    基本信息
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* 分类和标题 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">分类</Label>
                      <TreeSelect
                        categories={categories}
                        value={formData.category}
                        onValueChange={(value) => setFormData({...formData, category: value})}
                        placeholder="请选择分类"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="title">
                        <span className="text-red-500">*</span> 标题
                      </Label>
                      <Input
                        id="title"
                        required
                        placeholder="请输入文章标题"
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        className="font-medium"
                      />
                    </div>
                  </div>

                  {/* 摘要 */}
                  <div className="space-y-2">
                    <Label htmlFor="summary">文章摘要</Label>
                    <Textarea
                      id="summary"
                      placeholder="请输入文章摘要，用于搜索和列表显示..."
                      value={formData.summary}
                      onChange={(e) => setFormData({...formData, summary: e.target.value})}
                      className="min-h-[80px] resize-none"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>简洁的摘要有助于读者快速了解文章内容</span>
                      <span>{formData.summary.length} / 200</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 内容编辑器 */}
              <Card className="shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">
                    <span className="text-red-500">*</span> 文章内容
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg border overflow-hidden">
                    <MDEditor
                      value={formData.content}
                      onChange={(val) => setFormData({...formData, content: val || ''})}
                      preview="edit"
                      hideToolbar={false}
                      textareaProps={{
                        placeholder: '请输入文章内容，支持 Markdown 语法...',
                        required: true,
                        style: {
                          fontSize: 14,
                          lineHeight: 1.6,
                        }
                      }}
                      height={400}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* 标签和封面 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="shadow-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg flex items-center">
                      <Tag className="h-4 w-4 mr-2" />
                      标签管理
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="tags">添加标签</Label>
                      <Input
                        id="tags"
                        placeholder="输入标签，用逗号分隔"
                        value={formData.tags}
                        onChange={(e) => setFormData({...formData, tags: e.target.value})}
                      />
                    </div>
                    {parseTags().length > 0 && (
                      <div className="space-y-2">
                        <Label>当前标签</Label>
                        <div className="flex flex-wrap gap-2">
                          {parseTags().map((tag, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="pl-2 pr-1 py-1"
                            >
                              {tag}
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-4 w-4 p-0 ml-1 hover:bg-red-100"
                                onClick={() => removeTag(tag)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="shadow-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg flex items-center">
                      <ImageIcon className="h-4 w-4 mr-2" />
                      封面图片
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <input
                      type="file"
                      id="cover-image-upload"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    
                    {coverImagePreview ? (
                      <div className="space-y-4">
                        <div className="relative">
                          <img
                            src={coverImagePreview}
                            alt="封面预览"
                            className="w-full h-48 object-cover rounded-lg border"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={clearCoverImage}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full"
                          onClick={() => document.getElementById('cover-image-upload')?.click()}
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          更换图片
                        </Button>
                      </div>
                    ) : (
                      <div 
                        className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:border-blue-300 hover:bg-blue-50/50 transition-colors cursor-pointer"
                        onClick={() => document.getElementById('cover-image-upload')?.click()}
                      >
                        <div className="flex flex-col items-center space-y-3">
                          <div className="p-3 bg-blue-100 rounded-full">
                            <Upload className="h-6 w-6 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-700">点击上传封面图片</p>
                            <p className="text-xs text-gray-500 mt-1">支持 JPG, PNG 格式，最大 5MB</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* SEO和高级设置 */}
              <Card className="shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg flex items-center">
                    <Search className="h-4 w-4 mr-2" />
                    SEO设置
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="seoDescription">SEO描述</Label>
                    <Textarea
                      id="seoDescription"
                      placeholder="用于搜索引擎优化的描述，建议120-160字符..."
                      value={formData.seoDescription}
                      onChange={(e) => setFormData({...formData, seoDescription: e.target.value})}
                      className="min-h-[60px] resize-none"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>良好的SEO描述有助于提高搜索排名</span>
                      <span>{formData.seoDescription.length} / 160</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-amber-50 rounded-lg border border-amber-200">
                    <div>
                      <Label htmlFor="showTopPreview" className="font-medium text-amber-900">
                        置顶文章
                      </Label>
                      <p className="text-xs text-amber-700 mt-1">
                        开启后文章将在首页置顶显示
                      </p>
                    </div>
                    <Switch
                      id="showTopPreview"
                      checked={formData.showTopPreview}
                      onCheckedChange={(checked) => setFormData({...formData, showTopPreview: checked})}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* 操作按钮 */}
              <div className="flex justify-end space-x-3 pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleOpenChange(false)}
                  className="px-6"
                >
                  取消
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="px-6"
                >
                  保存草稿
                </Button>
                <Button type="submit" className="px-6 bg-blue-600 hover:bg-blue-700">
                  立即发布
                </Button>
              </div>
            </form>
          </div>
      </DialogContent>
    </Dialog>
  );
}