// pages/goods_detail/index.js
import { request } from "../../request/index.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsObj:{}
  },
  //商品对象 全局变量
  GoodsInfo:{},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const {goods_id}=options;
    this.getGoodsDetail(goods_id);
  },
  
  
  //获取商品详情数据
  getGoodsDetail(goods_id){
    const goodsObj=request({ url:"https://api-hmugo-web.itheima.net/api/public/v1/goods/detail",data:{goods_id}
    }).then(res => {
      this.GoodsInfo = res.data.message;

      this.setData({
        goodsObj:{
          goods_name:res.data.message.goods_name,
          goods_price: res.data.message.goods_price,
          //防止部分iPhone手机不支持.webp格式图片
          goods_introduce: res.data.message.goods_introduce.replace(/\.webp/g, '.jpg'),//正则表达式
          pics: res.data.message.pics
        }
      });
      
    });
    
  
  },
  //点击轮播图 放大预览
  handlePrevewImage(e){
    //1 构造要预览的图片数组
    const urls = this.GoodsInfo.pics.map(v => v.pics_mid);
    //接收传递过来的URL图片
    const current = e.currentTarget.dataset.url;
    wx.previewImage({
      current: current,
      urls: urls,
    })
  },

  //点击加入购物车
  handleCartAdd(){
    //1 获取缓存中的购物车 数组
    let cart=wx.getStorageSync("cart")||[];
    //2 判断 商品对象是否存在于购物车数组中
    let index=cart.findIndex(v=>v.goods_id===this.GoodsInfo.goods_id);
    if(index===-1){
      //3 不存在购物车中 第一次添加
      this.GoodsInfo.num=1;
      //添加后 是否默认选中
      this.GoodsInfo.checked=true;
      cart.push(this.GoodsInfo);
    }else{
      //已经存在购物车数据 执行num++
      cart[index].num++;
    }
    //5 吧购物车数据重新添加回缓存中
    wx.setStorageSync("cart", cart);
    //6 弹窗提示
    wx.showToast({
      title: '老板大气！',
      icon:'success',
      mask:true
    })
  }

  
})