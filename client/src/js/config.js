/*
 * 설정
 * 운영 전환시 
 *  1. client / config의  base_url 변경
 *  2. server / routes/admin/login.js 에서 ip 체크부분 변경
 */

module.exports = {
    base_url: "http://localhost:8031",
    // 운영 전환
    // base_url: "https://stocknet.koscom.co.kr",
    // base_url: "http://stocknetmain.koscom.co.kr",
    // base_url: "http://stocknettest.koscom.co.kr",
}