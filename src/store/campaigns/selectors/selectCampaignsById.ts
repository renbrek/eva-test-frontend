import { RootState } from '../..';

export const selectCampaignsById = (
  state: RootState,
  campaignId: string | undefined
) => {
  const campaignById = state.campaigns.campaigns.find(
    (campaign) => campaign.id === campaignId
  );

  return campaignById;
};
