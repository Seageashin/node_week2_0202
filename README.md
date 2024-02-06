//ERD 주소
https://drawsql.app/teams/-886/diagrams/2

//API 명세서 주소
https://www.notion.so/cbcc3f2af793473594cba53a78696ca8?v=a687de057aab4788b51ea3699c7811f6&pvs=4

//암호화 방식
단방향이며,
다양한 길이를 가진 데이터를 고정된 길이를 가진 데이터로 매핑(mapping)한 값이다. 이를 이용해 특정 배열의 인덱스나 위치나 위치를 입력하고자 하는 데이터의 값을 이용해 저장하거나 찾을 수 있다.

//인증 방식
1.문제점
토큰 유출로 인한 계정 해킹

2.보완 방법:
HTTPS 사용
토큰의 유효 기간 제한
Refresh Token 사용

//인증과 인가
1.인증
인증은 서비스 이용자를 검증하는 작업이다.

2.인가
인가는 인증된 사용자가 특정 리소스에 접근 또는 특정 작업을 수행할 권한이 있는지 검증하는 작업이다.

3.과제에서 구현한 Middleware는 인증에 해당하나요? 인가에 해당하나요?
인증의 요소도 있으나 인가에 가깝다고 볼 수 있다. 예를 들어 이력서 상세조회를 위해 인증된 사용자의 접근 권한을 검증하기 때문이다.

//Http Status Code
회원가입 (/sign-up):

성공 (201): return res.status(201).json({ message: "회원가입이 완료되었습니다." });
비밀번호가 6자 미만일 때 (409): return res.status(409).json({ message: "비밀번호가 6자 이상이어야 됩니다." });
비밀번호 확인 불일치 (409): return res.status(409).json({ message: "비밀번호 확인과 일치해야 합니다." });
이미 존재하는 이메일 (409): return res.status(409).json({ message: "이미 존재하는 이메일입니다." });
로그인 (/sign-in):

성공 (200): return res.status(200).json({ message: "로그인 성공" });
존재하지 않는 이메일 (401): return res.status(401).json({ message: "존재하지 않는 이메일입니다." });
비밀번호 불일치 (401): return res.status(401).json({ message: "비밀번호가 일치하지 않습니다." });
사용자 정보 조회 (/users):

성공 (200): return res.status(200).json({ data: user });
사용자 인증 실패 (401): (authMiddleware에서 처리) return res.status(401).json({ message: "Unauthorized" });
그 외 서버 에러 (500): (에러 발생 시) next(err);

이력서 등록 (/resume - POST):

성공 (201): return res.status(201).json({ data: resume });
이력서 상태가 이상할 때 (409): return res.status(409).json({ message: "이력서 상태가 이상합니다." });
이력서 목록 조회 (/resume - GET):

성공 (200): return res.status(200).json({ data: resume });
특정 이력서 조회 (/resume/:resumeId - GET):

성공 (200): return res.status(200).json({ data: resume });
이력서 삭제 (/resume/:resumetId - DELETE):

성공 (200): return res.status(200).json({ message: "삭제 성공" });
이력서를 찾을 수 없을 때 (404): return res.status(404).json({ message: "이력서를 찾을 수 없습니다." });
본인이 작성한 이력서가 아닐 때 (403): return res.status(403).json({ message: "본인이 작성한 이력서만 삭제할 수 있습니다." });
서버 오류 (500): return res.status(500).json({ message: "서버 오류" });
이력서 수정 (/resume/:resumeId - PUT):

성공 (200): return res.status(200).json(updatedResume);
이력서 상태가 이상할 때 (409): return res.status(409).json({ message: "이력서 상태가 이상합니다." });
해당 이력서를 찾을 수 없을 때 (404): return res.status(404).json({ message: "해당 이력서를 찾을 수 없습니다." });
서버 오류 (500): return res.status(500).json({ message: "서버 오류가 발생하였습니다." });

//리팩토링
1.데이터 모델 및 쿼리 변경 그리고 트랜잭션 처리
2. .env와 같은 파일 수정

//API 명세서
쉬운 세팅 및 사용, 직관성, 실제 API 호출 기능 제공
