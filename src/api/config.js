const BASE = 'http://10.155.195.226:3000'
export const config = {
  base: BASE,
  loginUrl: `${BASE}/phone/login`,
  registerUrl: `${BASE}/phone/newUser`,
  changePasswordUrl: `${BASE}/phone/updatePwd`,
  getCarouselList: `${BASE}/phone/carouselList`,
  uploadAvatar: `${BASE}/phone/uploadAvatar`,
  updateUserInfo: `${BASE}/phone/updateUser`,
  fileUploadUrl: `${BASE}/phone/uploadFile`,
  createWork: `${BASE}/phone/createWork`,
  getAllWorks: `${BASE}/phone/workList`,
  // 分类作品
  workTypeList: `${BASE}/phone/workTypeList`,

  getType: `${BASE}/phone/getType`,
  getWorkDetail: `${BASE}/phone/workDetail`,
  searchAttention: `${BASE}/phone/searchAttention`, // 判断是否已关注
  submitAttention: `${BASE}/phone/attention`,
  cancelAttention: `${BASE}/phone/cancelAttention`,
  comment: `${BASE}/phone/comment`,
  initWorkComment: `${BASE}/phone/initWorkComment`,
  reply: `${BASE}/phone/reply`,
  deleteReply: `${BASE}/phone/deleteReply`, // 删除回复
  deleteComment: `${BASE}/phone/deleteComment`, // 删除评论块
  judgeCollect: `${BASE}/phone/judgeCollect`,
  addCollect: `${BASE}/phone/addCollect`, // 添加收藏
  cancelCollect: `${BASE}/phone/cancelCollect`, // 取消收藏
  judgeLike: `${BASE}/phone/judgeLike`,
  addLikes: `${BASE}/phone/addLikes`, // 添加点赞
  cancelLikes: `${BASE}/phone/cancelLikes`, // 取消点赞
  myRelation: `${BASE}/phone/myRelation`, // 我的关注（用户）
  myCollect: `${BASE}/phone/myCollect`, // 我的收藏 （作品）
  myWork: `${BASE}/phone/myWork`, // 我的作品
  userWork: `${BASE}/phone/userWork`, // author Work
  userList: `${BASE}/phone/userList`, // 所有用户
  relationWork: `${BASE}/phone/relationWork`,
  deleteWork: `${BASE}/phone/deleteWork`, // 删除作品
  likesList: `${BASE}/phone/likesList`,
  WorkNewList: `${BASE}/phone/WorkNewList`,
  courseList: `${BASE}/phone/courseList`,
  // about exhibition
  exhibitionList: `${BASE}/phone/exhibitionList`,
  exhibitionWork: `${BASE}/phone/exhibitionWork`,
  myExhibition: `${BASE}/phone/myExhibition`,
  myExhibitionWork: `${BASE}/phone/myExhibitionWork`,
  joinExhibition: `${BASE}/phone/joinExhibition`,
  likeExhibitionWork: `${BASE}/phone/likeExhibitionWork`,
  uploadJoin: `${BASE}/phone/uploadJoin`
}
