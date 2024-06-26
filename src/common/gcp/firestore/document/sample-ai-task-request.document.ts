// ! This is firestore document
// ! This includes infomation about VR generating request.

export interface SampleAiTaskRequest {
  /** 요청 아이디 */
  id: string;

  /** 제목 */
  title: string;

  /** 생성 일자 */
  createdAt: Date;

  /** 현재 작업 상태 */
  status: 'pending' | 'processing' | 'completed' | 'failed';

  /* ----------------------------------- 기본값 ---------------------------------- */

  /** 작업 타입 */
  type: 'scene' | 'avatar';

  /* ----------------------------------- 아바타 ---------------------------------- */

  /** 몸통 사진의 위치 */
  bodyImagePath?: string;

  /** 얼굴 사진의 위치 */
  faceImagePath?: string;

  /** 아바타 성별 */
  gender?: 'male' | 'female' | 'neutral';

  /* ----------------------------------- 배경 ----------------------------------- */

  /** 배경 위치 */
  location?: 'indoor' | 'outdoor' | 'unbound';

  /** 배경 비디오 */
  sceneVideoPath?: string;

  /* ------------------------------- deprecated ------------------------------- */
  // // /** 그룹(환자) 아이디 */
  // // groupId: string;

  // // /** 생성자 아이디 */
  // // creatorId: string;
}
