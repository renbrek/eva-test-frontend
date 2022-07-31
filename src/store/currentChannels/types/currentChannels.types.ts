export type Channel = {
  id: string;
  createdAd: Date;
  updatedAt: Date;
  type: ChannelTypes;
  text: string;
  isActive: boolean;
  campaignId: string;
  isInlineKeyboard: boolean;
  buttons: Button[];
};

export type Button = {
  id: string;
  createdAd: Date;
  updatedAt: Date;
  isInlineButton: boolean;
  isLinkButton: boolean;
  text: string;
  link: string;
  keyboardId: string;
};

type ChannelTypes = 'vk' | 'whatsup' | 'telegram' | 'sms';
