
  interface ResponseInterface {
    data: any;
    status: number;
    message?: string;
    timestamp?: number;
  }

  interface AppFeatureInterface {
    vip: boolean;
    live: boolean;
    book: boolean;
    topic: boolean;
    paper: boolean;
    practice: boolean;
    mockPaper: boolean;
    wrongBook: boolean;
    wenda: boolean;
    share: boolean;
    codeExchanger: boolean;
    snapshort: boolean;
    promoCode: boolean;
    daySignIn: boolean;
    credit1Mall: boolean;
    tuangou: boolean;
    miaosha: boolean;
    cert: boolean;
  }

  interface AppConfigInterface {
    aboutus: string;
    credit1Reward: {
      register: number;
      watched_vod_course: number;
      watched_video: number;
      paid_order: string;
    };
    enabledAddons: string[];
    wxUrl: string;
    icp: string;
    icp2: string;
    icp2Link: string;
    icpLink: string;
    logo: {
      logo: string;
      white_logo?: string;
    };
    member: {
      enabledMobileBindAlert: number;
      enabledFaceVerify: boolean;
    };
    pcUrl: string;
    player: {
      cover: string;
      enabled_benabledBulletSecretullet_secret: string;
      bulletSecret: {
        color: string;
        opacity: string;
        size: string;
        text: string;
      };
    };
    socialites: {
      qq: number;
      wechat_scan: number;
      wechat_oauth: number;
    };
    url: string;
    userPrivateProtocol: string;
    userProtocol: string;
    webName: string;
  }

  interface UserDetailInterface {
    avatar: string;
    created_at: string;
    credit1: number;
    credit2: number;
    credit3: number;
    id: number;
    invite_balance: number;
    invite_people_count: number;
    is_active: number;
    is_bind_mobile: number;
    is_bind_qq: number;
    is_bind_wechat: number;
    is_face_verify: boolean;
    is_lock: number;
    is_password_set: number;
    is_set_nickname: number;
    mobile: string;
    nick_name: string;
    profile_id_number: string;
    profile_real_name: string;
    role?: {
      id: number;
      name: string;
      desc_rows?: string[];
    };
    role_expired_at: null;
    role_id: number;
  }

