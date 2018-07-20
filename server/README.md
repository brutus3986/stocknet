# 공지사항

# 운영서버 이행시

## Usage

## MongDB
(mongoDB window 실행 쉘)
- mongod --dbpath \Users\DB400\database\stocknet
- mongod --dbpath \database\stocknet
- mongod
(mongoDB 리눅스 실행 쉘)
- mongod --dbpath /data/mongodb

(index 중복처리)
- mongo
> db.webwatches.ensureIndex({seq:1}, {unique:true})

(mongoDB 다운)
-mongo
> use admin
> db.shutdownServer()

(mongoDB 신규 필드 추가)
db.boards.update({}, {$set:{"notice":false, "display":true}}, false, true)
db.users.update({userid:"nms"}, {$set:{user_level:"admin"}}, false, true)

## Developing

    <script src="https://cdnjs.cloudflare.com/ajax/libs/js-polyfills/0.1.41/polyfill.min.js"></script>

### Tools


## 데이터 입력
#users
db.users.insert({userid:"pbmail01", password:"pbmail01"});
#admin
db.admin.insert({userid:"admin", password:"tnsenddl1!"});
#boards
db.boards.insertMany([
{bbs_id:1, story_id:26, title:"트래픽 계측시간 변경 안내", 
contents:"test contents", writer:"관리자", view:123, created_at:new Date(), updated_at:new Date()},
{bbs_id:1, story_id:25, title:"웹서비스 접속 URL 변경 안내", 
contents:"test contents", writer:"관리자", view:123, created_at:new Date(), updated_at:new Date()},
{bbs_id:1, story_id:24, title:"회선 트래픽 추가 제공 안내 [주문 및 시세 테스트]", 
contents:"test contents", writer:"관리자", view:123, created_at:new Date(), updated_at:new Date()},
{bbs_id:1, story_id:23, title:"트래픽 조회시간 변경에 대한 안내", 
contents:"test contents", writer:"관리자", view:123, created_at:new Date(), updated_at:new Date()},
{bbs_id:1, story_id:22, title:"[사용법 안내] 메뉴 및 조회화면", 
contents:"test contents", writer:"관리자", view:123, created_at:new Date(), updated_at:new Date()},
{bbs_id:1, story_id:21, title:"[사용법 안내] 트래픽 그래프 및 엑셀 자료", 
contents:"test contents", writer:"관리자", view:123, created_at:new Date(), updated_at:new Date()},
{bbs_id:1, story_id:20, title:"코스콤 IT리스크관리부 담당자 연락처", 
contents:"test contents", writer:"관리자", view:123, created_at:new Date(), updated_at:new Date()},
{bbs_id:1, story_id:19, title:"코스콤 증권망 회선 트래픽 웹서비스 사용안내",
contents:"test contents", writer:"관리자", view:123, created_at:new Date(), updated_at:new Date()},
{bbs_id:1, story_id:18, title:"트래픽 계측시간 변경 안내", 
contents:"test contents", writer:"관리자", view:123, created_at:new Date(), updated_at:new Date()},
{bbs_id:1, story_id:17, title:"웹서비스 접속 URL 변경 안내", 
contents:"test contents", writer:"관리자", view:123, created_at:new Date(), updated_at:new Date()},
{bbs_id:1, story_id:16, title:"회선 트래픽 추가 제공 안내 [주문 및 시세 테스트]", 
contents:"test contents", writer:"관리자", view:123, created_at:new Date(), updated_at:new Date()},
{bbs_id:1, story_id:15, title:"트래픽 조회시간 변경에 대한 안내", 
contents:"test contents", writer:"관리자", view:123, created_at:new Date(), updated_at:new Date()},
{bbs_id:1, story_id:14, title:"[사용법 안내] 메뉴 및 조회화면", 
contents:"test contents", writer:"관리자", view:123, created_at:new Date(), updated_at:new Date()},
{bbs_id:1, story_id:13, title:"[사용법 안내] 트래픽 그래프 및 엑셀 자료", 
contents:"test contents", writer:"관리자", view:123, created_at:new Date(), updated_at:new Date()},
{bbs_id:1, story_id:12, title:"코스콤 IT리스크관리부 담당자 연락처", 
contents:"test contents", writer:"관리자", view:123, created_at:new Date(), updated_at:new Date()},
{bbs_id:1, story_id:10, title:"코스콤 증권망 회선 트래픽 웹서비스 사용안내",
contents:"test contents", writer:"관리자", view:123, created_at:new Date(), updated_at:new Date()},
{bbs_id:2, story_id:8, title:"트래픽 계측시간 변경 안내", 
contents:"test contents", writer:"관리자", view:123, created_at:new Date(), updated_at:new Date()},
{bbs_id:2, story_id:7, title:"웹서비스 접속 URL 변경 안내", 
contents:"test contents", writer:"관리자", view:123, created_at:new Date(), updated_at:new Date()},
{bbs_id:2, story_id:6, title:"회선 트래픽 추가 제공 안내 [주문 및 시세 테스트]", 
contents:"test contents", writer:"관리자", view:123, created_at:new Date(), updated_at:new Date()},
{bbs_id:2, story_id:5, title:"트래픽 조회시간 변경에 대한 안내", 
contents:"test contents", writer:"관리자", view:123, created_at:new Date(), updated_at:new Date()},
{bbs_id:2, story_id:4, title:"[사용법 안내] 메뉴 및 조회화면", 
contents:"test contents", writer:"관리자", view:123, created_at:new Date(), updated_at:new Date()},
{bbs_id:2, story_id:3, title:"[사용법 안내] 트래픽 그래프 및 엑셀 자료", 
contents:"test contents", writer:"관리자", view:123, created_at:new Date(), updated_at:new Date()},
{bbs_id:2, story_id:2, title:"코스콤 IT리스크관리부 담당자 연락처", 
contents:"test contents", writer:"관리자", view:123, created_at:new Date(), updated_at:new Date()},
{bbs_id:2, story_id:1, title:"코스콤 증권망 회선 트래픽 웹서비스 사용안내",
contents:"test contents", writer:"관리자", view:123, created_at:new Date(), updated_at:new Date()}
])		
