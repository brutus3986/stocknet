<template>
    <main>
        <UserMainHeader></UserMainHeader>
        <router-view></router-view>
    </main>
</template>

<script>
import  UserMainHeader  from   './../common/UserMainHeader.vue'
export default {
    components: {
        UserMainHeader: UserMainHeader,
    }
}
</script>

<style scoped>
</style>