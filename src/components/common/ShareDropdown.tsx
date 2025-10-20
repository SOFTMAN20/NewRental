/**
 * SHAREDROPDOWN.TSX - SOCIAL MEDIA SHARE COMPONENT
 * ================================================
 * 
 * Kipengele cha kushiriki kwenye mitandao ya kijamii
 * Component for sharing on social media platforms
 * 
 * FEATURES / VIPENGELE:
 * - WhatsApp sharing
 * - Facebook sharing
 * - Instagram (copy link)
 * - Twitter/X sharing
 * - Copy link functionality
 * - Beautiful dropdown UI
 */

import React, { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Share2, Copy, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Social media icons (using emojis for simplicity, can be replaced with actual icons)
const WhatsAppIcon = () => (
  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
);

const FacebookIcon = () => (
  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const TwitterIcon = () => (
  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

interface ShareDropdownProps {
  title: string;
  description: string;
  url: string;
  className?: string;
  variant?: 'ghost' | 'default' | 'outline';
  size?: 'sm' | 'default' | 'lg';
}

const ShareDropdown: React.FC<ShareDropdownProps> = ({
  title,
  description,
  url,
  className = '',
  variant = 'ghost',
  size = 'sm',
}) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  /**
   * SHARE TO WHATSAPP
   * ================
   */
  const shareToWhatsApp = () => {
    const text = encodeURIComponent(`${title}\n\n${description}\n\n${url}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  /**
   * SHARE TO FACEBOOK
   * ================
   */
  const shareToFacebook = () => {
    const shareUrl = encodeURIComponent(url);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`, '_blank');
  };

  /**
   * SHARE TO TWITTER/X
   * =================
   */
  const shareToTwitter = () => {
    const text = encodeURIComponent(description);
    const shareUrl = encodeURIComponent(url);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${shareUrl}`, '_blank');
  };

  /**
   * COPY LINK FOR INSTAGRAM
   * ======================
   * Instagram doesn't have direct web sharing, so we copy the link
   */
  const copyForInstagram = async () => {
    await copyToClipboard();
    toast({
      title: 'Kiungo kimehifadhiwa!',
      description: 'Fungua Instagram na ubandike kiungo kwenye bio au story yako.',
    });
  };

  /**
   * COPY TO CLIPBOARD
   * ================
   */
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast({
        title: 'Imefanikiwa!',
        description: 'Kiungo kimehifadhiwa. Unaweza kukibandika popote.',
      });
      
      // Reset copied state after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Hitilafu',
        description: 'Imeshindikana kuhifadhi kiungo. Jaribu tena.',
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className={className}
          title="Shiriki nyumba hii"
        >
          <Share2 className="h-4 w-4 sm:h-5 sm:w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {/* WhatsApp */}
        <DropdownMenuItem
          onClick={shareToWhatsApp}
          className="cursor-pointer flex items-center gap-3 py-3"
        >
          <div className="text-green-600">
            <WhatsAppIcon />
          </div>
          <span className="text-base">WhatsApp</span>
        </DropdownMenuItem>

        {/* Facebook */}
        <DropdownMenuItem
          onClick={shareToFacebook}
          className="cursor-pointer flex items-center gap-3 py-3"
        >
          <div className="text-blue-600">
            <FacebookIcon />
          </div>
          <span className="text-base">Facebook</span>
        </DropdownMenuItem>

        {/* Twitter/X */}
        <DropdownMenuItem
          onClick={shareToTwitter}
          className="cursor-pointer flex items-center gap-3 py-3"
        >
          <div className="text-sky-500">
            <TwitterIcon />
          </div>
          <span className="text-base">Twitter</span>
        </DropdownMenuItem>

        {/* Instagram */}
        <DropdownMenuItem
          onClick={copyForInstagram}
          className="cursor-pointer flex items-center gap-3 py-3"
        >
          <div className="text-pink-600">
            <InstagramIcon />
          </div>
          <span className="text-base">Instagram</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Copy Link */}
        <DropdownMenuItem
          onClick={copyToClipboard}
          className="cursor-pointer flex items-center gap-3 py-3"
        >
          <div className="text-gray-600">
            {copied ? (
              <Check className="h-5 w-5 text-green-600" />
            ) : (
              <Copy className="h-5 w-5" />
            )}
          </div>
          <span className="text-base">
            {copied ? 'Imenakiliwa!' : 'Copy Link'}
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ShareDropdown;
