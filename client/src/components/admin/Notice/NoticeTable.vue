<template>
    <table class="table tbl-stocknet table-hover">
        <thead>
            <tr class="info">
                <th>No.</th>
                <th>제목</th>
                <th>작성자</th>
                <th>날짜</th>
                <th>조회수</th>
            </tr>
        </thead>
        <tbody> 
            <tr v-for="story in stories" v-bind:key="story.story_id" @click="showStory(story)">
                <td v-bind:class="{ 'notice': story.notice==true }" v-if="story.notice==true"> 
                   <span class="notice"><strong>공지</strong></span>
				</td>
                <td  v-else v-bind:class="{ 'notice': story.notice==true }">
                    {{story.story_id}}
                </td>
                <td  class="tal" v-bind:class="{ 'notice': story.notice==true }">
                    {{story.title}}
                </td>
                <td  v-bind:class="{ 'notice': story.notice==true }">
                    {{story.writer}}
                </td>
                <td  v-bind:class="{ 'notice': story.notice==true }">
                    {{story.updated_at}}
                </td>
                <td  v-bind:class="{ 'notice': story.notice==true }">
                    {{story.view}}
                </td>
            </tr>
        </tbody>
    </table>
</template>

<script>
export default {
    props: ['stories'],
    data() {
        return {
        };
    },
    methods: {
        showStory:function(story) {
            this.$EventBus.$emit("showStory", story) ;
        },
        
    }
}
</script>

<style scoped>
.tbl-stocknet {border-top:2px solid #111;}
.tbl-stocknet thead th {background:#f9f9f9;border-left:1px solid #dcdcdc;border-bottom:1px solid #dcdcdc;text-align:center;color:#111;font-size:1.0625rem;font-weight: normal;}
.tbl-stocknet thead th:first-child {border-left:none;}
.tbl-stocknet tbody td {border-bottom:1px solid #dcdcdc;padding:13px 10px 14px;text-align:center;cursor: pointer;}
.tbl-stocknet tbody td.tal {text-align:left;}
.table-hover>tbody>tr:hover td.notice {background:#f2f9ff;}
.table-hover>tbody>tr:hover {background:#f9f9f9;}
.notice {background:#f9fbfd;}
span.notice {background:#94bae0;border-radius:3px;padding:1px 5px 3px;color:#FFF;font-size:0.8125rem;}
</style>
