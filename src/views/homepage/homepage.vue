<template>
  <div>
<!--    <div class="container-fluid">-->
<!--      <div class="header clearfix">-->
<!--        <a href="javascript:;" class="logo">传智播客</a>-->
<!--        <div class="h-right">-->
<!--          <div class="img-box">-->
<!--            <img src="@/assets/index/img-kdy-hover.png" alt="">-->
<!--          </div>-->
<!--          <p class="user-name">姜浩然</p>-->
<!--          <div class="more">-->
<!--            <div class="icon icon-sj"></div>-->
<!--          </div>-->
<!--        </div>-->
<!--      </div>-->
<!--    </div>-->
    <!-- 主体 -->
    <div class="main">
      <ul class="clearfix">
        <li class="list">
          <a href="javascipt:;">
            <div class="img-box oa">
              <img src="@/assets/index/img-oa.png" alt="综合办公系统" class="front">
              <img src="@/assets/index/img-oa-hover.png" alt="综合办公系统" class="back">
            </div>
            <p class="title">OA</p>
            <p class="desc">综合办公系统</p>
          </a>
        </li>
        <li class="list">
          <a href="javascipt:;">
            <div class="img-box bs">
              <img src="@/assets/index/img-beisen.png" alt="人事批复系统" class="front">
              <img src="@/assets/index/img-beisen-hover.png" alt="人事批复系统" class="back">
            </div>
            <p class="title">北森</p>
            <p class="desc">人事批复系统</p>
          </a>
        </li>
        <li class="list">
          <a href="javascipt:;">
            <div class="img-box team">
              <img src="@/assets/index/img-team.png" alt="团队协作" class="front">
              <img src="@/assets/index/img-team-hover.png" alt="团队协作" class="back">
            </div>
            <p class="title">Teambition</p>
            <p class="desc">团队协作</p>
          </a>
        </li>
        <li class="list">
          <a href="javascipt:;">
            <div class="img-box kdy">
              <img src="@/assets/index/img-kdy.png" alt="少儿编程系统" srcset="" class="front">
              <img src="@/assets/index/img-kdy-hover.png" alt="少儿编程系统" srcset="" class="back">
            </div>
            <p class="title">酷丁鱼</p>
            <p class="desc">少儿编程系统</p>
          </a>
        </li>
        <li class="list">
          <a href="javascipt:;">
            <div class="img-box yxb">
              <img src="@/assets/index/img-yxb.png" alt="高校教学系统" class="front">
              <img src="@/assets/index/img-yxb-hover.png" alt="高校教学系统" class="back">
            </div>
            <p class="title">院校邦</p>
            <p class="desc">高校教学系统</p>
          </a>
        </li>
        <li class="list">
          <a href="javascipt:;">
            <div class="img-box czh">
              <img src="@/assets/index/img-czh.png" alt="新媒体平台" class="front">
              <img src="@/assets/index/img-czh-hover.png" alt="新媒体平台" class="back">
            </div>
            <p class="title">传智汇</p>
            <p class="desc">新媒体平台</p>
          </a>
        </li>
        <li class="list">
          <a href="javascipt:;">
            <div class="img-box tlias">
              <img src="@/assets/index/img-tlias.png" alt="教学质量监测系统" class="front">
              <img src="@/assets/index/img-tlias-hover.png" alt="教学质量监测系统" class="back">
            </div>
            <p class="title">TLIAS</p>
            <p class="desc">教学质量监测系统</p>
          </a>
        </li>
        <li class="list">
          <a href="javascipt:;">
            <div class="img-box ems">
              <img src="@/assets/index/img-ems.png" alt="数据查询系统" class="front">
              <img src="@/assets/index/img-ems-hover.png" alt="数据查询系统" class="back">
            </div>
            <p class="title">EMS</p>
            <p class="desc">数据查询系统</p>
          </a>
        </li>
        <li class="list">
          <a href="javascipt:;">
            <div class="img-box plab">
              <img src="@/assets/index/img-plab.png" alt="人事批复系统" class="front">
              <img src="@/assets/index/img-plab-hover.png" alt="人事批复系统" class="back">
            </div>
            <p class="title">PLAB</p>
            <p class="desc">人事批复系统</p>
          </a>
        </li>
        <li class="list">
          <a href="javascipt:;">
            <div class="img-box evias">
              <img src="@/assets/index/img-evias.png" alt="团队协作" class="front">
              <img src="@/assets/index/img-evias-hover.png" alt="团队协作" class="back">
            </div>
            <p class="title">Evias</p>
            <p class="desc">团队协作</p>
          </a>
        </li>
      </ul>
      <div class="ad">
        <a href="javascript:;">
          <img src="@/assets/index/ad.png" alt="广告" srcset="" class="front">
        </a>
      </div>
    </div>

  </div>
</template>

<script>
    export default {
        name: "homepage"
    }
</script>

<style lang="scss" scoped>
  // 变量
  $width: 1200px;

  //公用
  .clearfix:after {
    visibility: hidden;
    display: block;
    font-size: 0;
    content: ' ';
    clear: both;
    height: 0;
  }

  .clearfix {
    zoom: 1;
  }

  @mixin one-line-ellipsis {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    word-break: break-all;
  }

  // 正式内容
  html,
  body {
    background: #F5F7FA;
  }

  .container-fluid {
    width: 100%;
    height: 54px;
    background: #2A2E3F;
  }

  a {
    text-decoration: none;
  }

  .header {
    margin: 0 auto;
    width: $width;

    .logo {
      float: left;
      margin-top: 11px;
      width: 523px;
      height: 31px;
      background: url('./../../assets/index/logo.png') no-repeat center;
      text-indent: -9999px;
    }

    .h-right {
      float: right;
      width: 120px;
      height: 36px;
      margin-top: 9px;
      position: relative;

      .img-box {
        float: left;
        width: 36px;
        height: 36px;
        overflow: hidden;
        border-radius: 50%;
        background: #fff;

        img {
          width: 100%;
          height: 100%;
        }
      }

      .user-name {
        float: left;
        padding-left: 8px;
        line-height: 36px;
        font-size: 14px;
        color: #C0C4CC;
      }

      .more {
        position: absolute;
        top: 50%;
        right: 0;
        margin-top: -4px;
      }
    }

  }

  // 主体
  .main {
    margin: 0 auto;
    margin-top: 120px;
    width: 1025px;

    .list {
      float: left;
      // position: relative;
      margin-right: 5px;
      margin-bottom: 5px;
      // padding-top: 126px;
      padding-bottom: 20px;
      width: 200px;
      height: 180px;
      overflow: hidden;
      background: #E8ECF2;

      a {
        position: relative;
        display: block;
        width: 200px;
        padding-top: 126px;
        height: 54px;

        .img-box {
          position: absolute;
          display: table-cell;
          width: 148px;
          height: 40px;
          overflow: hidden;
          text-align: center;
          line-height: 40px;
          top: 62px;
          left: 50%;
          margin-left: -74px;
          background-size: 128px 36px;

          img {
            margin: 0 auto;
            display: block;
            vertical-align: middle;
            max-width: 100%;
          }
          .back {
            display: none;
          }
        }

        &:hover {
          .img-box {


            .front {
              display: none;
            }

            .back {
              display: block;
            }
          }
        }

        .title,
        .desc {
          line-height: 22px;
          text-align: center;
          letter-spacing: 1px;
          @include one-line-ellipsis;
        }

        .title {

          color: #2A2E3F;
          font-size: 16px;
          font-weight: 500;
        }

        .desc {
          margin-top: 10px;
          color: #606266;
        }
      }

    }

    // 广告
    .ad {

      margin-top: 92px;
      width: 1025px;
      height: 150px;
      border-radius: 40px;
      overflow: hidden;
    }
  }



  .icon {
    display: block;
  }

  .icon-sj {
    width: 12px;
    height: 8px;
    background: url('./../../assets/index/icon-sj.png') no-repeat center;
  }
</style>
