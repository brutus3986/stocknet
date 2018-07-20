<template>
    <table class="table tbl-stocknet table-hover">
        <thead>
            <tr class="info">
				<th>고객사명</th>
                <th>사용자계정</th>
                <th>핸드폰번호</th>
                <th>E-mail</th>
                <th>조회용 장비명</th>
                <th>변경일자</th>
                <th>당일접속</th>
                <th>누적접속</th>
            </tr>
        </thead>
        <tbody> 
            <tr v-for="user in userslist" v-bind:key="user.userid" @click="showInfo(user)">
                <td>
                    {{user.name}}
                </td>
                <td>
                    {{user.userid}}
                </td>
                <td>
                    {{user.phone+ user.phonenumber}}
                </td>
                <td>
                    {{user.email}}
                </td>
                <td class="abbreviation">
                    {{user.machine_name}}
                </td>
                <td>
                    {{user.updated_at}}
                </td>
                <td>
                    {{user.today_visit}}
                </td>
                <td>
                    {{user.total_visit}}
                </td>
            </tr>
        </tbody>
    </table>
</template>

<script>

export default {
    props: ['userslist'],
    data() {
        return {
        };
    },
    methods: {
        showInfo:function(user) {
            this.$EventBus.$emit("showInfo", user) ;
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
.pnt{
    cursor: pointer; 
}

.table td.abbreviation{
/* 
<text가 길어서 ....생략으로 보이고 싶을경우>
1. width 또는 height가 고정적일 것
2. overflow: hidden; 을 사용해 영역을 감출 것
3. 아래줄로 내려가는 것을 막기위해 white-space: nowrap 등이 필요
*/
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  word-wrap: break-word;
  min-width: 180px;
  max-width: 180px;
}
</style>
