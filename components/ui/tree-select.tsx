"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { ChevronDown, ChevronRight, Check, Folder, FolderOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Category } from '@/lib/types';

interface TreeSelectProps {
  categories: Category[];
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
}

interface TreeNodeProps {
  category: Category;
  selectedValue?: string;
  onSelect: (value: string) => void;
  level?: number;
}

function TreeNode({ category, selectedValue, onSelect, level = 0 }: TreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasChildren = category.children && category.children.length > 0;
  const isSelected = selectedValue === category.slug;

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (hasChildren) {
      setIsExpanded(!isExpanded);
    }
  };

  const handleSelect = () => {
    if (!hasChildren) {
      onSelect(category.slug);
    }
  };

  return (
    <div>
      <CommandItem
        key={category.id}
        value={category.slug}
        onSelect={handleSelect}
        className={cn(
          "flex items-center cursor-pointer",
          level > 0 && "pl-6"
        )}
      >
        <div className="flex items-center flex-1">
          {hasChildren ? (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 mr-2"
              onClick={handleToggle}
              type="button"
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          ) : (
            <div className="w-6 mr-2" />
          )}
          
          <div className="mr-2">
            {hasChildren ? (
              isExpanded ? (
                <FolderOpen className="h-4 w-4 text-blue-500" />
              ) : (
                <Folder className="h-4 w-4 text-blue-500" />
              )
            ) : (
              <div className="h-4 w-4 rounded-sm border border-gray-300 bg-gray-50" />
            )}
          </div>
          
          <span className="flex-1">{category.name}</span>
          
          {isSelected && (
            <Check className="h-4 w-4 ml-2" />
          )}
        </div>
      </CommandItem>
      
      {hasChildren && isExpanded && (
        <div className="ml-4">
          {category.children?.map((child) => (
            <TreeNode
              key={child.id}
              category={child}
              selectedValue={selectedValue}
              onSelect={onSelect}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function TreeSelect({ categories, value, onValueChange, placeholder = "请选择分类" }: TreeSelectProps) {
  const [open, setOpen] = useState(false);

  const findCategoryBySlug = (slug: string, cats: Category[]): Category | null => {
    for (const cat of cats) {
      if (cat.slug === slug) return cat;
      if (cat.children) {
        const found = findCategoryBySlug(slug, cat.children);
        if (found) return found;
      }
    }
    return null;
  };

  const selectedCategory = value ? findCategoryBySlug(value, categories) : null;

  const handleSelect = (categorySlug: string) => {
    onValueChange?.(categorySlug);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedCategory ? selectedCategory.name : placeholder}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0">
        <Command>
          <CommandInput placeholder="搜索分类..." />
          <CommandList>
            <CommandEmpty>未找到分类</CommandEmpty>
            <CommandGroup>
              {categories.map((category) => (
                <TreeNode
                  key={category.id}
                  category={category}
                  selectedValue={value}
                  onSelect={handleSelect}
                />
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}