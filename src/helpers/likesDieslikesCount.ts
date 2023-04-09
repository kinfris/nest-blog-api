type likeStatusesType = 'None' | 'Like' | 'Dislike';

export const likesDislikesCountCalculation = (
  likeStatus: likeStatusesType,
  userLikeStatus: likeStatusesType,
) => {
  const likesDislikesCount = { like: 0, dislike: 0 };

  if (likeStatus === 'None' && userLikeStatus === 'Like') {
    likesDislikesCount.like = -1;
  }
  if (likeStatus === 'None' && userLikeStatus === 'Dislike') {
    likesDislikesCount.dislike = -1;
  }
  if (likeStatus === 'Like' && userLikeStatus === 'None') {
    likesDislikesCount.like = 1;
  }
  if (likeStatus === 'Like' && userLikeStatus === 'Dislike') {
    likesDislikesCount.like = 1;
    likesDislikesCount.dislike = -1;
  }
  if (likeStatus === 'Dislike' && userLikeStatus === 'None') {
    likesDislikesCount.dislike = 1;
  }
  if (likeStatus === 'Dislike' && userLikeStatus === 'Like') {
    likesDislikesCount.dislike = 1;
    likesDislikesCount.like = -1;
  }

  return likesDislikesCount;
};
