<template>
    <main>
        <div class="container">
            <br>
            <div class="form">   
                <div class="total-num">   <!-- 게시판 글 수  -->
                    <span class="count"> 전체글 : <em>{{ count }} </em></span>
                </div>    
                <div class="search">     <!-- 제목으로 검색  -->
                    <div class="form-group">
                        <select v-model="seloption" class="form-control">
                            <option v-for="option in options" :key="option.index" :value="option.value">
                                {{option.text}}
                            </option>    
                        </select>
                    </div>
                    <div class="form-group">
                        <input type="text" class="form-control" v-model.trim="searchinfo" v-on:keyup.enter="fetchStories"/>
                    </div>    
                </div>       
            </div>
            <NoticeTable :stories="stories"></NoticeTable>
            <div class="paging-row">
                <div class="pginnerdiv">
                    <ul class="pagination">
                        <li class="page-item"><a class="page-link"  @click="prevStory"> &lt;&lt; </a></li>
                        <li v-for="curPage in totalPage" v-bind:key="curPage.index">
                            <a class="page-link curpage"  @click="setPage(curPage)">
                                {{curPage}}
                            </a>
                        </li> 
                        <li class="page-item"><a class="page-link"  @click="nextStory"> &gt;&gt; </a></li>
                    </ul>
                </div>       
            </div>
            <NoticeModal v-if="showModal" :storyinfo="storyinfo" :gubun="modalgubun"></NoticeModal>
        </div>
    </main>
</template>

<script>
import Config       from "./../../../js/config.js"
import NoticeTable  from "./NoticeTable.vue"
import NoticeModal  from "./NoticeModal.vue"

export default {
        props: [],
        data() {
            return {
                // 공지사항 bbs_id : 1
                bbs_id    : 1,
                curPage   : 1,
                totalPage : 0,
                perPage   : 10,
                showModal : false,
                stories   : [],
                storyinfo : {},
                modalgubun: 0,
                searchinfo:'',
                count     : 0,
                seloption: 'title',
                options:[
                    {text:"제목",   value:"title"},
                    {text:"작성자", value:"writer"},
                    {text:"내용",   value:"contents"}
                ]
            };
        },
        components: {
            NoticeTable : NoticeTable,
            NoticeModal : NoticeModal
        },
        computed:{
            
        },
        created: function() {
            this.$EventBus.$on('closeStory'  , this.closeStory );
            this.$EventBus.$on('showStory'   , this.showStory  );
            this.$EventBus.$on('searchStory' , this.searchStory);
        },
        beforeDestroy() {
            this.$EventBus.$off('closeStory' );
            this.$EventBus.$off('showStory'  );
            this.$EventBus.$off('searchStory'  );
        },
        mounted: function() {
            this.fetchStories();
        },
        methods: {
            fetchStories: function() {
                console.log('fetchStories');
                var vm = this;
                                
                axios.get(Config.base_url+'/user/board/liststory', {
                    params: {
                        "bbs_id" : this.bbs_id,
                        "seloption"  : this.seloption,
                        "searchinfo" : this.searchinfo,
                        "curPage": this.curPage,
                        "perPage": this.perPage
                    }
                }).then(function(response) {
                    // console.log(response);
                    var tstories = response.data.stories;
                    var tcount = response.data.count;
                    tstories.forEach(function(story, index) {
                        story.updated_at = story.updated_at.substring(0, 10);
                    });

                    vm.stories = tstories;
                    vm.totalPage = response.data.pageInfo.totalPage;
                    vm.count = tcount;
                });
            },
            clearStoryInfo: function() {
                console.log('clearStoryInfo');
                this.modalgubun = 1;     // 신규 1, 수정 2
                this.storyinfo = {
                    "bbs_id"  : 1,
                    "story_id": 0,
                    "writer"  : "",
                    "title"   : "",
                    "contents": "",
                    "view"    : 0,
                    "notice"  : false,    // 공지사항 체크박스
                };
            },
            showStory: function(story) {
                console.log("showStory");
                this.clearStoryInfo();
                this.storyinfo.story_id   = story.story_id;
                this.storyinfo.writer     = story.writer;
                this.storyinfo.title      = story.title;
                this.storyinfo.contents   = story.contents;
                this.storyinfo.notice     = story.notice ;
                this.storyinfo.view       = story.view ;
                this.storyinfo.updated_at = story.updated_at ;
                this.modalgubun = 2;    // 신규 1, 수정 2
                this.showModal  = true;
            },
            updateViewCount: function(story){
                console.log("updateViewCount");
                var vm = this;
                story.view = story.view + 1;
                
                axios.post(Config.base_url+'/user/board/updateviewcount', {
                    "bbs_id"   : this.bbs_id,
                    "story_id" : story.story_id,
                    "view"     : story.view,
                }).then(function(response) {
                    // console.log(response);
                    vm.fetchStories();
                });
                
            },
            closeStory: function(story) {
                console.log("closeStory");
                var vm = this;
                vm.updateViewCount(story);
                vm.showModal = false;
            },
            prevStory: function() {
                if (this.curPage > 1) {
                    this.curPage -= 1;
                    this.fetchStories();
                }
            },
            setPage : function(curPage){
                this.curPage = curPage;
                this.fetchStories();
            },
            nextStory: function() {
                if (this.totalPage > this.curPage) {
                    this.curPage += 1;
                    this.fetchStories();
                }
            }
        }
    }
</script>
<style scoped>
.form {display:block;padding-bottom: 1rem;}
.total-num {float:left;}
.search {float:right;}
.form-group {display: inline-block;}
.form-control {border-radius: 2px;}
.count {color:#777;font-size: 1.25rem;}
.count em {color:#1577da;font-style: normal;font-weight: bold;}
.paging-row {
    width: 100%;
    text-align : center;
}
.pginnerdiv{
    display: inline-block;
}
ul.pagination li {display: inline;}

ul.pagination li a {
    color: rgb(32, 32, 32);
    float: left;
    padding: 8px 16px;
    text-decoration: none;
    transition: background-color .3s;
    border: 1px solid #ddd;
}
/* .curpaget {background-color:rgb(219, 158, 145)} */
ul li a:hover, ul li a:focus {  
    color:#fff;  
    border:1px solid rgb(228, 219, 217);  
    background-color:rgb(228, 219, 217);   
}
ul.pagination li a:hover:not(.active) {background-color: #ddd;}
.tar {text-align:right;}
.btn-basic {background:#2877c7;color:#FFF;font-size:1.0625rem;padding:6px 16px 7px;}
.btn-basic:hover {background:#145392;}

</style>
