// pages/category/index.js
//引入用来发送请求的方法 
import { request } from "../../request/index.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //左侧的数据菜单
    leftMenuList:[],
    //右侧的商品数据
    rightContent:[],
    //被点击的左侧菜单
    currentIndex:0,
    //右侧商品内容与顶部的距离
    scrollTop:0
  },
  //接口的返回数据
  Cates:[],


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    /**  缓存技术----------------------
     * 1 先判断本地储存中有没有旧的数据
     *    本地数据格式：{time:Date.now()//这是一个时间戳，代表存进去的时间,data:[...]}
     * 2 没有旧数据 直接发送新请求
     * 3 有旧数据 同时 旧数据也没有过期 就使用 本地储存中的旧数据即可
     * ---------------------------------------
     */

    //1 先获取本地存储的数据（小程序中也有本地存储技术的）
    const Cates=wx.getStorageSync("cates");
    //2 判断
    if(!Cates){
      //不存在 发送请求数据
      this.getCates();
    }else{
      //有旧的数据 要定义过期时间  十秒钟 1000*10 单位毫秒  十秒钟
      if(Date.now()-Cates.time>1000*60*10){
          //重新发送请求
        this.getCates();
      }else{
        //使用旧数据
        this.Cates=Cates.data;
        let leftMenuList = this.Cates.map(v => v.cat_name);
        let rightContent = this.Cates[0].children;
        this.setData({ leftMenuList, rightContent })
      }
    }
    
  },



  //获取分类数据
  getCates(){
    request({
      url:"http://localhost:8080/myproject/categories.json"
    })
    .then(res=>{
      this.Cates=res.data.message;

      //把接口的数据存入到本地存储中
      wx.setStorageSync("cates", {time:Date.now(),data:this.Cates});

      //构造左侧的大菜单数据
      let leftMenuList=this.Cates.map(v=>v.cat_name);
      //构造右侧商品数据
      let rightContent=this.Cates[0].children;
      this.setData({leftMenuList,rightContent})
    })
  },


  //左侧菜单点击事件
  handleItemTap(e){
    /**
     * 1 获取被点击的标题身上的索引
     * 2 给data中的currentIndex赋值就可以了
     * 3 根据不同的索引来渲染商品的内容
     */
    const{index}=e.currentTarget.dataset;
    let rightContent = this.Cates[index].children;
    this.setData({
      currentIndex:index,
      rightContent,
      //设置这个参数为零，则每次点击列表后右边商品在顶部开始显示
      scrollTop:0
    })
  },



















  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})