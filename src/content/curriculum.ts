import type { ActivityDefinition } from '@/lib/learning/types';
import vocabularyData from './vocabulary.json';

export interface CurriculumLesson {
  slug: string;
  title: string;
  summary: string;
  durationMinutes: number;
  objective: {
    code: string;
    title: string;
    description: string;
    kind: string;
  };
  explanation: string;
  examples: Array<{ japanese: string; chinese: string; reading: string }>;
  activities: ActivityDefinition[];
}

export interface CurriculumUnit {
  slug: string;
  title: string;
  description: string;
  vocabularyTarget: number;
  grammarTopics: string[];
  lessons: CurriculumLesson[];
}

export interface CurriculumCourse {
  slug: string;
  title: string;
  description: string;
  level: string;
  version: number;
  units: CurriculumUnit[];
}

export interface VocabularyWord {
  id: string;
  japanese: string;
  reading: string;
  chinese: string;
  english: string;
  unitSlug: string;
  matchScore: number;
  reviewedOverride: boolean;
}

export const N5_VOCABULARY = vocabularyData.words as VocabularyWord[];

function choiceActivity(
  id: string,
  objectiveCode: string,
  prompt: string,
  japanese: string,
  options: string[],
  value: string,
  explanation: string,
): ActivityDefinition {
  return {
    id,
    type: 'MULTIPLE_CHOICE',
    objectiveCode,
    prompt,
    content: { japanese, options },
    answer: { value },
    explanation,
  };
}

function inputActivity(
  id: string,
  objectiveCode: string,
  prompt: string,
  japanese: string,
  value: string,
  accepted: string[],
  explanation: string,
): ActivityDefinition {
  return {
    id,
    type: 'TEXT_INPUT',
    objectiveCode,
    prompt,
    content: { japanese },
    answer: { value, accepted },
    explanation,
  };
}

const CORE_COURSE: CurriculumCourse = {
  slug: 'n5-foundation',
  title: '从零开始的 N5 主线',
  description: '用中文理解日语，在真实场景中完成听、读和写的基础闭环。',
  level: 'N5',
  version: 1,
  units: [
    {
      slug: 'kana-sounds',
      title: '假名与声音',
      description: '掌握平假名、片假名和日语的基本音节。',
      vocabularyTarget: 40,
      grammarTopics: ['清音', '浊音', '半浊音', '拗音', '促音', '长音'],
      lessons: [
        {
          slug: 'kana-vowels',
          title: '从五个元音开始',
          summary: '认识 あいうえお，并建立字形、读音和罗马音的连接。',
          durationMinutes: 12,
          objective: { code: 'N5-KANA-01', title: '识读五个元音', description: '看到或听到五个基础元音时能够正确辨认。', kind: 'kana' },
          explanation: '日语假名按音节组织。あ、い、う、え、お是整个五十音图的基础，先把字形和声音直接连接，不必依赖中文谐音。',
          examples: [
            { japanese: 'あい', chinese: '爱', reading: 'あい' },
            { japanese: 'うえ', chinese: '上面', reading: 'うえ' },
          ],
          activities: [
            choiceActivity('kana-01-choice', 'N5-KANA-01', '选择「あ」的罗马音', 'あ', ['a', 'i', 'u', 'e'], 'a', '「あ」读作 a。'),
            inputActivity('kana-01-input', 'N5-KANA-01', '输入「う」的罗马音', 'う', 'u', ['U'], '「う」读作 u。'),
            { id: 'kana-01-trace', type: 'KANA_TRACE', objectiveCode: 'N5-KANA-01', prompt: '按笔顺描摹「あ」', content: { traceCharacter: 'あ', japanese: 'あ' }, answer: { value: 'あ' }, explanation: '注意第二笔与第三笔的衔接。' },
          ],
        },
        {
          slug: 'kana-combinations',
          title: '特殊音节不再混淆',
          summary: '理解浊音、拗音、促音和长音如何改变读法。',
          durationMinutes: 14,
          objective: { code: 'N5-KANA-02', title: '辨认特殊音节', description: '能够区分 きゃ、が、っ 和长音。', kind: 'kana' },
          explanation: '小写假名会改变前一个音节。小「ゃゅょ」组成拗音，小「っ」表示后面的辅音停顿一拍，片假名的「ー」表示长音。',
          examples: [
            { japanese: 'きって', chinese: '邮票', reading: 'きって' },
            { japanese: 'ジュース', chinese: '果汁', reading: 'ジュース' },
          ],
          activities: [
            choiceActivity('kana-02-choice', 'N5-KANA-02', '选择「きゃ」的读法', 'きゃ', ['kya', 'kiya', 'kita', 'gya'], 'kya', '小「ゃ」与「き」合成一个音节 kya。'),
            inputActivity('kana-02-input', 'N5-KANA-02', '输入「きって」的罗马音', 'きって', 'kitte', ['KITTE'], '小「っ」让后面的 t 停顿并双写。'),
          ],
        },
      ],
    },
    {
      slug: 'introductions',
      title: '认识与介绍',
      description: '用最基础的句型介绍自己和身边的人。',
      vocabularyTarget: 60,
      grammarTopics: ['です', 'は', 'か', 'も'],
      lessons: [
        {
          slug: 'watashi-wa',
          title: '我是……',
          summary: '用「A は B です」表达身份和主题。',
          durationMinutes: 12,
          objective: { code: 'N5-GRAMMAR-01', title: '使用主题句', description: '能用 は 和 です 完成简单自我介绍。', kind: 'grammar' },
          explanation: '「は」提示接下来要谈论的主题，作助词时读作 wa。「です」放在句末，让表达礼貌完整。',
          examples: [
            { japanese: '私は林です。', chinese: '我姓林。', reading: 'わたしは はやしです' },
            { japanese: '私は学生です。', chinese: '我是学生。', reading: 'わたしは がくせいです' },
          ],
          activities: [
            choiceActivity('intro-01-choice', 'N5-GRAMMAR-01', '选择正确的主题助词', '私＿学生です。', ['は', 'を', 'で', 'に'], 'は', '谈论“我”时用主题助词「は」。'),
            inputActivity('intro-01-input', 'N5-GRAMMAR-01', '补全句子：我是学生', '私は学生＿。', 'です', ['デス'], '礼貌判断句以「です」结尾。'),
            { id: 'intro-01-order', type: 'ORDERING', objectiveCode: 'N5-GRAMMAR-01', prompt: '按顺序组成「我是学生」', content: { tokens: ['学生', 'です', '私', 'は', '。'] }, answer: { value: ['私', 'は', '学生', 'です', '。'] }, explanation: '先说主题「私 は」，再说身份「学生 です」。' },
            { id: 'intro-01-correct', type: 'ERROR_CORRECTION', objectiveCode: 'N5-GRAMMAR-01', prompt: '改正助词错误，输入完整句子', content: { japanese: '私を学生です。' }, answer: { value: '私は学生です。', accepted: ['私は学生です'] }, explanation: '这里的「私」是句子的主题，要用「は」，不能用宾语助词「を」。' },
          ],
        },
        {
          slug: 'questions-and-too',
          title: '提问与“也”',
          summary: '使用 か 提问，使用 も 表示相同信息。',
          durationMinutes: 10,
          objective: { code: 'N5-GRAMMAR-02', title: '提出基础问题', description: '能组成礼貌疑问句并回应共同点。', kind: 'grammar' },
          explanation: '句末加「か」即可把礼貌陈述变成问题。「も」替换「は」时表示“也”。',
          examples: [
            { japanese: '田中さんは先生ですか。', chinese: '田中先生是老师吗？', reading: 'たなかさんは せんせいですか' },
            { japanese: '私も学生です。', chinese: '我也是学生。', reading: 'わたしも がくせいです' },
          ],
          activities: [
            choiceActivity('intro-02-choice', 'N5-GRAMMAR-02', '选择能把句子变成问题的词', '学生です＿。', ['か', 'も', 'を', 'へ'], 'か', '礼貌疑问句以「か」结尾。'),
            inputActivity('intro-02-input', 'N5-GRAMMAR-02', '补全：我也是中国人', '私＿中国人です。', 'も', ['モ'], '「も」表示“也”。'),
          ],
        },
      ],
    },
    {
      slug: 'things-and-places',
      title: '物品与地点',
      description: '指认物品，询问位置，并表达所属关系。',
      vocabularyTarget: 70,
      grammarTopics: ['これ・それ・あれ', 'この・その・あの', 'の', 'ここ・そこ・あそこ'],
      lessons: [
        {
          slug: 'demonstratives',
          title: '这个、那个、哪个',
          summary: '根据说话双方的位置选择こ、そ、あ系列。',
          durationMinutes: 12,
          objective: { code: 'N5-GRAMMAR-03', title: '使用指示词', description: '能用指示词询问和指认物品。', kind: 'grammar' },
          explanation: '靠近说话人用「これ」，靠近听话人用「それ」，离双方都远用「あれ」。后面直接接名词时使用「この・その・あの」。',
          examples: [
            { japanese: 'これは何ですか。', chinese: '这是什么？', reading: 'これは なんですか' },
            { japanese: 'その本は私のです。', chinese: '那本书是我的。', reading: 'そのほんは わたしのです' },
          ],
          activities: [choiceActivity('place-01-choice', 'N5-GRAMMAR-03', '物品靠近听话人时选什么？', '＿は辞書ですか。', ['これ', 'それ', 'あれ', 'どこ'], 'それ', '靠近听话人的物品用「それ」。')],
        },
        {
          slug: 'location-and-possession',
          title: '地点与所属',
          summary: '使用地点指示词和 の 描述位置与关系。',
          durationMinutes: 12,
          objective: { code: 'N5-GRAMMAR-04', title: '说明地点与所属', description: '能询问地点并表达物品属于谁。', kind: 'grammar' },
          explanation: '「どこ」询问地点。「A の B」表示 B 与 A 的所属或类别关系。',
          examples: [
            { japanese: 'トイレはどこですか。', chinese: '洗手间在哪里？', reading: 'トイレは どこですか' },
            { japanese: 'これは日本の車です。', chinese: '这是日本的汽车。', reading: 'これは にほんの くるまです' },
          ],
          activities: [inputActivity('place-02-input', 'N5-GRAMMAR-04', '补全：我的书', '私＿本', 'の', ['ノ'], '名词之间用「の」连接所属关系。')],
        },
      ],
    },
    {
      slug: 'time-and-numbers',
      title: '数字与时间',
      description: '处理价格、日期、时刻和常用量词。',
      vocabularyTarget: 70,
      grammarTopics: ['数字', '时刻', '日期', '量词', 'に'],
      lessons: [
        {
          slug: 'clock-and-schedule',
          title: '几点做什么',
          summary: '读出时刻，并用 に 标记动作发生的时间点。',
          durationMinutes: 13,
          objective: { code: 'N5-TIME-01', title: '表达时间', description: '能询问时刻并描述日程。', kind: 'time' },
          explanation: '具体时刻后通常加「に」。今天、明天、每天等相对时间一般不加「に」。',
          examples: [
            { japanese: '七時に起きます。', chinese: '七点起床。', reading: 'しちじに おきます' },
            { japanese: '毎日勉強します。', chinese: '每天学习。', reading: 'まいにち べんきょうします' },
          ],
          activities: [choiceActivity('time-01-choice', 'N5-TIME-01', '选择正确助词', '九時＿寝ます。', ['に', 'を', 'が', 'で'], 'に', '具体时刻后用「に」。')],
        },
        {
          slug: 'prices-and-counters',
          title: '价格与数量',
          summary: '询问价格并用基础量词表达数量。',
          durationMinutes: 13,
          objective: { code: 'N5-TIME-02', title: '表达价格与数量', description: '能理解常用数字音变和基础量词。', kind: 'vocabulary' },
          explanation: '数字接不同量词时读音会变化。先掌握「ひとつ、ふたつ」以及人数「ひとり、ふたり」。',
          examples: [
            { japanese: 'これはいくらですか。', chinese: '这个多少钱？', reading: 'これは いくらですか' },
            { japanese: 'りんごを二つください。', chinese: '请给我两个苹果。', reading: 'りんごを ふたつ ください' },
          ],
          activities: [inputActivity('time-02-input', 'N5-TIME-02', '输入“两个人”的日语读法', '二人', 'ふたり', ['フタリ'], '人数一和二分别读作「ひとり」「ふたり」。')],
        },
      ],
    },
    {
      slug: 'daily-actions',
      title: '每日行动',
      description: '使用礼貌体动词描述日常生活。',
      vocabularyTarget: 70,
      grammarTopics: ['ます形', 'を', 'で', 'へ', 'ません'],
      lessons: [
        {
          slug: 'verbs-and-objects',
          title: '动作与对象',
          summary: '使用 を 标记动作直接作用的对象。',
          durationMinutes: 12,
          objective: { code: 'N5-VERB-01', title: '使用礼貌体动词', description: '能用 ます形描述常见动作。', kind: 'grammar' },
          explanation: '礼貌体现在时肯定以「ます」结尾，否定以「ません」结尾。动作对象通常用「を」标记。',
          examples: [
            { japanese: '朝ご飯を食べます。', chinese: '吃早饭。', reading: 'あさごはんを たべます' },
            { japanese: 'コーヒーを飲みません。', chinese: '不喝咖啡。', reading: 'コーヒーを のみません' },
          ],
          activities: [choiceActivity('verb-01-choice', 'N5-VERB-01', '选择宾语助词', '本＿読みます。', ['を', 'に', 'と', 'へ'], 'を', '阅读这一动作直接作用于书，用「を」。')],
        },
        {
          slug: 'place-and-direction',
          title: '在哪里做，往哪里去',
          summary: '区分动作场所 で 和移动方向 へ。',
          durationMinutes: 12,
          objective: { code: 'N5-VERB-02', title: '区分场所助词', description: '能正确选择 で、に、へ。', kind: 'grammar' },
          explanation: '动作发生的场所用「で」，移动目的地常用「に」或「へ」。',
          examples: [
            { japanese: '図書館で勉強します。', chinese: '在图书馆学习。', reading: 'としょかんで べんきょうします' },
            { japanese: '学校へ行きます。', chinese: '去学校。', reading: 'がっこうへ いきます' },
          ],
          activities: [choiceActivity('verb-02-choice', 'N5-VERB-02', '选择动作场所助词', '家＿映画を見ます。', ['で', 'へ', 'を', 'と'], 'で', '看电影这一动作发生在家里，用「で」。')],
        },
      ],
    },
    {
      slug: 'existence',
      title: '存在与位置',
      description: '表达某处有人、动物或物品。',
      vocabularyTarget: 70,
      grammarTopics: ['あります', 'います', 'に', 'が', '位置词'],
      lessons: [
        {
          slug: 'aru-and-iru',
          title: '有生命与无生命',
          summary: '区分 あります 和 います。',
          durationMinutes: 12,
          objective: { code: 'N5-EXIST-01', title: '表达存在', description: '能根据对象选择存在动词。', kind: 'grammar' },
          explanation: '人和动物等有生命对象用「います」，物品、植物和地点等通常用「あります」。',
          examples: [
            { japanese: '猫がいます。', chinese: '有一只猫。', reading: 'ねこが います' },
            { japanese: '机があります。', chinese: '有一张桌子。', reading: 'つくえが あります' },
          ],
          activities: [choiceActivity('exist-01-choice', 'N5-EXIST-01', '选择正确的存在动词', '犬が＿。', ['います', 'あります', 'します', 'です'], 'います', '狗是有生命对象，用「います」。')],
        },
        {
          slug: 'where-things-are',
          title: '东西在哪里',
          summary: '用位置词组成“某处有某物”的句子。',
          durationMinutes: 12,
          objective: { code: 'N5-EXIST-02', title: '描述空间位置', description: '能使用上、下、里面、旁边等位置词。', kind: 'grammar' },
          explanation: '基本结构是「地点 に 对象 が あります／います」。位置词放在名词后，用「の」连接。',
          examples: [
            { japanese: '机の上に本があります。', chinese: '桌上有一本书。', reading: 'つくえの うえに ほんが あります' },
            { japanese: '駅の前に人がいます。', chinese: '车站前有人。', reading: 'えきの まえに ひとが います' },
          ],
          activities: [inputActivity('exist-02-input', 'N5-EXIST-02', '补全存在地点的助词', '部屋＿猫がいます。', 'に', ['ニ'], '存在地点用「に」标记。')],
        },
      ],
    },
    {
      slug: 'descriptions',
      title: '描述、喜好与家人',
      description: '用形容词表达性质与偏好，并谈论家人与经历。',
      vocabularyTarget: 70,
      grammarTopics: ['い形容词', 'な形容词', '好き', 'が', 'より', 'と', 'ことができます', 'ことがあります'],
      lessons: [
        {
          slug: 'adjectives',
          title: '两类形容词',
          summary: '区分 い形容词和 な形容词的基本用法。',
          durationMinutes: 14,
          objective: { code: 'N5-ADJ-01', title: '使用形容词', description: '能描述物品、地点和人物。', kind: 'grammar' },
          explanation: 'い形容词可直接放在名词前。な形容词修饰名词时需要加「な」，作句末判断时不加。',
          examples: [
            { japanese: '新しい本です。', chinese: '是一本新书。', reading: 'あたらしい ほんです' },
            { japanese: '静かな町です。', chinese: '是一个安静的城市。', reading: 'しずかな まちです' },
          ],
          activities: [choiceActivity('adj-01-choice', 'N5-ADJ-01', '选择正确形式', '＿部屋です。', ['きれいな', 'きれいい', 'きれいの', 'きれいに'], 'きれいな', '「きれい」是な形容词，修饰名词时加「な」。')],
        },
        {
          slug: 'likes-and-comparison',
          title: '喜欢与比较',
          summary: '表达喜好，并完成简单比较。',
          durationMinutes: 12,
          objective: { code: 'N5-ADJ-02', title: '表达喜好和比较', description: '能说喜欢什么，以及两者哪个更符合描述。', kind: 'grammar' },
          explanation: '「好き」前的对象通常用「が」。比较时可使用「A より B のほうが…」。',
          examples: [
            { japanese: '音楽が好きです。', chinese: '喜欢音乐。', reading: 'おんがくが すきです' },
            { japanese: '電車よりバスのほうが安いです。', chinese: '公交车比电车便宜。', reading: 'でんしゃより バスのほうが やすいです' },
          ],
          activities: [choiceActivity('adj-02-choice', 'N5-ADJ-02', '选择喜好的对象助词', '日本料理＿好きです。', ['が', 'を', 'へ', 'で'], 'が', '「好き」的对象通常用「が」。')],
        },
        {
          slug: 'family-and-quoting',
          title: '介绍家人与引用',
          summary: '掌握家族称呼并使用 と 引用说话内容。',
          durationMinutes: 12,
          objective: { code: 'N5-FAMILY-01', title: '谈论家庭', description: '能介绍家人和简单转述。', kind: 'vocabulary' },
          explanation: '谈自己的家人和称呼别人的家人时用词不同。引用说话或想法时常用「と」。',
          examples: [
            { japanese: '父は会社員です。', chinese: '我父亲是公司职员。', reading: 'ちちは かいしゃいんです' },
            { japanese: '母は「行ってきます」と言いました。', chinese: '母亲说了“我出门了”。', reading: 'ははは いってきますと いいました' },
          ],
          activities: [choiceActivity('family-01-choice', 'N5-FAMILY-01', '谈自己的父亲时选哪个词？', '＿は先生です。', ['父', 'お父さん', '父さん', 'お父'], '父', '向外人谈自己的父亲通常用「父」。')],
        },
        {
          slug: 'ability-and-experience',
          title: '会做与做过',
          summary: '使用 ことができます 和 ことがあります。',
          durationMinutes: 13,
          objective: { code: 'N5-FAMILY-02', title: '表达能力与经历', description: '能说明会做什么以及是否有过某种经历。', kind: 'grammar' },
          explanation: '动词辞书形加「ことができます」表示能力。动词た形加「ことがあります」表示曾经有过的经历。',
          examples: [
            { japanese: '日本語を読むことができます。', chinese: '会读日语。', reading: 'にほんごを よむことが できます' },
            { japanese: '京都へ行ったことがあります。', chinese: '去过京都。', reading: 'きょうとへ いったことが あります' },
          ],
          activities: [choiceActivity('family-02-choice', 'N5-FAMILY-02', '选择表示“会游泳”的表达', '泳ぐ＿。', ['ことができます', 'ことがあります', 'ています', 'たいです'], 'ことができます', '辞书形加「ことができます」表示能力。')],
        },
      ],
    },
    {
      slug: 'te-form',
      title: 'て形与请求',
      description: '连接动作，提出请求，并描述正在发生的事。',
      vocabularyTarget: 70,
      grammarTopics: ['て形', 'てください', 'ています', 'てもいいです'],
      lessons: [
        {
          slug: 'te-form-basics',
          title: '把动词变成て形',
          summary: '识别主要动词组并完成常见て形变化。',
          durationMinutes: 15,
          objective: { code: 'N5-TE-01', title: '变换て形', description: '能把高频动词变为て形。', kind: 'grammar' },
          explanation: 'て形变化取决于动词结尾。先按「うつる」「むぶぬ」「く」「ぐ」「す」分组记忆，再单独记住「行く→行って」。',
          examples: [
            { japanese: '書く → 書いて', chinese: '写 → 写了以后／请写', reading: 'かく → かいて' },
            { japanese: '読む → 読んで', chinese: '读 → 读了以后／请读', reading: 'よむ → よんで' },
          ],
          activities: [inputActivity('te-01-input', 'N5-TE-01', '输入「話す」的て形', '話す', '話して', ['はなして', 'ハナシテ'], '以「す」结尾的五段动词变为「して」。')],
        },
        {
          slug: 'requests-and-progress',
          title: '请求、许可与进行',
          summary: '使用て形提出请求并描述正在进行的动作。',
          durationMinutes: 13,
          objective: { code: 'N5-TE-02', title: '使用て形句型', description: '能提出礼貌请求、询问许可和描述进行状态。', kind: 'grammar' },
          explanation: '「てください」表示请求，「てもいいですか」询问许可，「ています」表示正在进行或持续状态。',
          examples: [
            { japanese: 'ここに名前を書いてください。', chinese: '请在这里写名字。', reading: 'ここに なまえを かいてください' },
            { japanese: '写真を撮ってもいいですか。', chinese: '可以拍照吗？', reading: 'しゃしんを とっても いいですか' },
          ],
          activities: [choiceActivity('te-02-choice', 'N5-TE-02', '选择礼貌请求', 'もう一度＿。', ['言ってください', '言いますか', '言いません', '言いました'], '言ってください', 'て形加「ください」构成礼貌请求。')],
        },
      ],
    },
    {
      slug: 'past-and-plans',
      title: '过去与计划',
      description: '回顾已经发生的事并表达愿望、邀请和安排。',
      vocabularyTarget: 70,
      grammarTopics: ['ました', 'ませんでした', 'たいです', 'ましょう', 'ませんか'],
      lessons: [
        {
          slug: 'past-tense',
          title: '昨天做了什么',
          summary: '使用礼貌体过去肯定和过去否定。',
          durationMinutes: 12,
          objective: { code: 'N5-PAST-01', title: '描述过去', description: '能用礼貌体回顾过去事件。', kind: 'grammar' },
          explanation: '礼貌体过去肯定用「ました」，过去否定用「ませんでした」。时间词帮助听者定位事件。',
          examples: [
            { japanese: '昨日映画を見ました。', chinese: '昨天看了电影。', reading: 'きのう えいがを みました' },
            { japanese: '朝ご飯を食べませんでした。', chinese: '没有吃早饭。', reading: 'あさごはんを たべませんでした' },
          ],
          activities: [choiceActivity('past-01-choice', 'N5-PAST-01', '选择过去否定形式', '昨日勉強＿。', ['しませんでした', 'しません', 'します', 'しましたか'], 'しませんでした', '「ませんでした」表示过去没有做。')],
        },
        {
          slug: 'wants-and-invitations',
          title: '想做与一起做',
          summary: '表达愿望，并自然地发出邀请。',
          durationMinutes: 12,
          objective: { code: 'N5-PAST-02', title: '表达愿望与邀请', description: '能说想做什么并邀请别人。', kind: 'grammar' },
          explanation: '动词ます形去掉ます后加「たいです」表示愿望。「ませんか」是较柔和的邀请，「ましょう」表示一起做。',
          examples: [
            { japanese: '日本へ行きたいです。', chinese: '想去日本。', reading: 'にほんへ いきたいです' },
            { japanese: '一緒に食べませんか。', chinese: '要不要一起吃？', reading: 'いっしょに たべませんか' },
          ],
          activities: [inputActivity('past-02-input', 'N5-PAST-02', '补全：想喝咖啡', 'コーヒーを飲み＿。', 'たいです', ['たい', 'タイデス'], 'ます形词干加「たいです」表达愿望。')],
        },
      ],
    },
    {
      slug: 'travel-and-services',
      title: '出行与服务场景',
      description: '在交通、购物、餐厅和问路场景中完成任务。',
      vocabularyTarget: 70,
      grammarTopics: ['から・まで', 'ください', '方位', '选择表达'],
      lessons: [
        {
          slug: 'directions-and-transport',
          title: '问路与乘车',
          summary: '询问路线、站点和所需时间。',
          durationMinutes: 14,
          objective: { code: 'N5-TRAVEL-01', title: '完成基础问路', description: '能理解并使用方向与交通表达。', kind: 'scenario' },
          explanation: '「から」标记起点，「まで」标记终点。问路时先说「すみません」，再提出简短问题。',
          examples: [
            { japanese: '駅までどうやって行きますか。', chinese: '到车站怎么走？', reading: 'えきまで どうやって いきますか' },
            { japanese: 'ここから十分です。', chinese: '从这里要十分钟。', reading: 'ここから じゅっぷんです' },
          ],
          activities: [choiceActivity('travel-01-choice', 'N5-TRAVEL-01', '选择表示终点的助词', '空港＿バスで行きます。', ['まで', 'から', 'を', 'と'], 'まで', '终点用「まで」标记。')],
        },
        {
          slug: 'restaurant-and-shopping',
          title: '点餐与购物',
          summary: '询问价格、选择商品并完成点餐。',
          durationMinutes: 14,
          objective: { code: 'N5-TRAVEL-02', title: '完成服务场景交流', description: '能在餐厅和商店提出基本需求。', kind: 'scenario' },
          explanation: '选择物品后可用「これをください」。点餐时使用数量加「お願いします」会更自然。',
          examples: [
            { japanese: 'これを一つください。', chinese: '请给我一个这个。', reading: 'これを ひとつ ください' },
            { japanese: 'ラーメンをお願いします。', chinese: '请给我一份拉面。', reading: 'ラーメンを おねがいします' },
          ],
          activities: [
            inputActivity('travel-02-input', 'N5-TRAVEL-02', '补全购买表达', 'これを一つ＿。', 'ください', ['下さい', 'クダサイ'], '请求对方给自己某物时用「ください」。'),
            { id: 'travel-02-menu', type: 'READING', objectiveCode: 'N5-TRAVEL-02', prompt: '看菜单：哪一样最便宜？', content: { japanese: 'メニュー：カレー 700円、ラーメン 800円、水 100円。', options: ['咖喱', '拉面', '水', '价格相同'] }, answer: { value: '水' }, explanation: '水是 100 円，低于咖喱的 700 円和拉面的 800 円。' },
          ],
        },
      ],
    },
    {
      slug: 'reading-and-listening',
      title: '阅读与听力整合',
      description: '在通知、短文和日常对话中提取关键信息。',
      vocabularyTarget: 80,
      grammarTopics: ['接续词', '信息定位', '语境推断'],
      lessons: [
        {
          slug: 'short-notices',
          title: '读懂短通知',
          summary: '从营业时间、告示和消息中定位人物、时间与地点。',
          durationMinutes: 15,
          objective: { code: 'N5-READ-01', title: '阅读实用短文', description: '能从短通知中提取明确事实。', kind: 'reading' },
          explanation: '先看问题，再在原文中寻找时间、地点、否定和条件。不要逐字翻译，先确认任务需要什么信息。',
          examples: [
            { japanese: '図書館は月曜日休みです。', chinese: '图书馆周一休息。', reading: 'としょかんは げつようび やすみです' },
            { japanese: '入口は二階にあります。', chinese: '入口在二楼。', reading: 'いりぐちは にかいに あります' },
          ],
          activities: [
            choiceActivity('read-01-choice', 'N5-READ-01', '根据通知选择休息日', '図書館は月曜日休みです。', ['星期一', '星期二', '星期六', '星期日'], '星期一', '「月曜日」是星期一。'),
            { id: 'read-01-notice', type: 'READING', objectiveCode: 'N5-READ-01', prompt: '读图书馆通知：星期六几点关门？', content: { japanese: '図書館のお知らせ。月曜日は休みです。火曜日から金曜日は九時から十八時までです。土曜日は十六時までです。', options: ['九点', '十六点', '十八点', '星期六休息'] }, answer: { value: '十六点' }, explanation: '通知最后说「土曜日は十六時まで」，即星期六开放到十六点。' },
          ],
        },
        {
          slug: 'daily-dialogues',
          title: '听懂日常短对话',
          summary: '利用场景和关键词判断对话目的。',
          durationMinutes: 15,
          objective: { code: 'N5-LISTEN-01', title: '理解日常短对话', description: '能听出人物下一步行动和关键信息。', kind: 'listening' },
          explanation: '先确认说话人、场景和问题，再听数字、时间、地点以及句末的决定。第一次抓主旨，第二次确认细节。',
          examples: [
            { japanese: '三時に駅で会いましょう。', chinese: '三点在车站见吧。', reading: 'さんじに えきで あいましょう' },
            { japanese: '今日は家で勉強します。', chinese: '今天在家学习。', reading: 'きょうは いえで べんきょうします' },
          ],
          activities: [{ id: 'listen-01-choice', type: 'LISTENING_CHOICE', objectiveCode: 'N5-LISTEN-01', prompt: '播放后选择见面时间', content: { audioText: '三時に駅で会いましょう。', options: ['一点', '两点', '三点', '四点'] }, answer: { value: '三点' }, explanation: '「三時」表示三点。' }],
        },
      ],
    },
    {
      slug: 'n5-review',
      title: 'N5 综合复习',
      description: '整合词汇、语法、阅读和听力，完成阶段评估。',
      vocabularyTarget: 60,
      grammarTopics: ['综合复习', '错因分析', '应试节奏'],
      lessons: [
        {
          slug: 'weak-points',
          title: '薄弱点集中修复',
          summary: '根据学习记录重练最不稳定的知识点。',
          durationMinutes: 15,
          objective: { code: 'N5-REVIEW-01', title: '修复薄弱知识', description: '能识别错误类型并完成针对性复练。', kind: 'review' },
          explanation: '错误不是简单扣分。先判断是词义、读音、助词、活用还是理解问题，再做同类型但不同表面的练习。',
          examples: [
            { japanese: '学校で勉強します。', chinese: '在学校学习。', reading: 'がっこうで べんきょうします' },
            { japanese: '学校へ行きます。', chinese: '去学校。', reading: 'がっこうへ いきます' },
          ],
          activities: [choiceActivity('review-01-choice', 'N5-REVIEW-01', '选择动作发生地点的助词', '喫茶店＿話します。', ['で', 'へ', 'に', 'を'], 'で', '动作发生地点用「で」。')],
        },
        {
          slug: 'n5-checkpoint',
          title: 'N5 阶段检查',
          summary: '完成综合检查，并生成下一阶段复习建议。',
          durationMinutes: 20,
          objective: { code: 'N5-REVIEW-02', title: '完成综合评估', description: '综合运用 N5 范围内的基础能力。', kind: 'checkpoint' },
          explanation: '综合检查会混合听力、词汇、语法和阅读。先完成有把握的题，再回到需要更多时间的题。',
          examples: [
            { japanese: '来週友達と京都へ行きます。', chinese: '下周和朋友去京都。', reading: 'らいしゅう ともだちと きょうとへ いきます' },
            { japanese: '雨ですから、家にいます。', chinese: '因为下雨，所以待在家。', reading: 'あめですから いえに います' },
          ],
          activities: [{ id: 'review-02-checkpoint', type: 'CHECKPOINT', objectiveCode: 'N5-REVIEW-02', prompt: '选择最符合句意的中文', content: { japanese: '来週友達と京都へ行きます。', options: ['上周一个人去了京都', '下周和朋友去京都', '明天朋友从京都来', '每周在京都学习'] }, answer: { value: '下周和朋友去京都' }, explanation: '「来週」是下周，「友達と」是和朋友一起。' }],
        },
      ],
    },
  ],
};

function vocabularyLessons(unitSlug: string): CurriculumLesson[] {
  const words = N5_VOCABULARY.filter((word) => word.unitSlug === unitSlug);
  const lessons: CurriculumLesson[] = [];
  for (let offset = 0; offset < words.length; offset += 5) {
    const batch = words.slice(offset, offset + 5);
    const number = Math.floor(offset / 5) + 1;
    const code = `N5-VOCAB-${batch[0].id.slice(-4)}`;
    lessons.push({
      slug: `vocabulary-${String(number).padStart(2, '0')}`,
      title: `常用词 ${String(number).padStart(2, '0')} · ${batch[0].japanese} 等`,
      summary: `认识 ${batch.length} 个高频词，练习字形、读音和中文意义。`,
      durationMinutes: 10,
      objective: { code, title: `识读第 ${number} 组常用词`, description: `能够认出 ${batch.map((word) => word.japanese).join('、')} 的常见意义。`, kind: 'vocabulary' },
      explanation: '先看日语字形和读音，再遮住中文主动回忆。词义会通过练习结果进入复习队列。',
      examples: batch.map((word) => ({ japanese: word.japanese, chinese: word.chinese, reading: word.reading })),
      activities: batch.map((word, index) => {
        const distractors = [...new Set(words.filter((candidate) => candidate.chinese !== word.chinese).map((candidate) => candidate.chinese))].slice((offset + index * 3) % Math.max(1, words.length - 3), (offset + index * 3) % Math.max(1, words.length - 3) + 3);
        const options = [word.chinese, ...distractors].sort((a, b) => (a.length + index) % 7 - (b.length + index) % 7 || a.localeCompare(b));
        return choiceActivity(`vocab-${word.id}`, `N5-WORD-${word.id}`, `「${word.japanese}」最常见的意思是？`, word.japanese, options, word.chinese, `「${word.japanese}」（${word.reading}）的常见意思是「${word.chinese}」。`);
      }).concat([
        {
          id: `vocab-listen-${batch[0].id}`,
          type: 'LISTENING_CHOICE',
          objectiveCode: `N5-WORD-${batch[0].id}`,
          prompt: '听发音，选出对应的词。',
          content: { audioText: batch[0].japanese, options: [batch[0].japanese, ...[...new Set(words.filter((word) => word.japanese !== batch[0].japanese).map((word) => word.japanese))].slice(offset % (words.length - 4), offset % (words.length - 4) + 3)] },
          answer: { value: batch[0].japanese },
          explanation: `听到的是「${batch[0].japanese}」（${batch[0].reading}）。`,
        },
        {
          id: `vocab-input-${batch[1].id}`,
          type: 'TEXT_INPUT',
          objectiveCode: `N5-WORD-${batch[1].id}`,
          prompt: `输入「${batch[1].japanese}」的假名读音。`,
          content: { japanese: batch[1].japanese },
          answer: { value: batch[1].reading },
          explanation: `读作「${batch[1].reading}」。`,
        },
      ]),
    });
  }
  return lessons;
}

function expandCoreLesson(lesson: CurriculumLesson, unit: CurriculumUnit): CurriculumLesson {
  const [readingExample, listeningExample] = lesson.examples;
  const translations = [...new Set(unit.lessons.flatMap((item) => item.examples.map((example) => example.chinese)))];
  function optionsFor(answer: string) {
    return [answer, ...translations.filter((translation) => translation !== answer).slice(0, 3)];
  }
  return {
    ...lesson,
    durationMinutes: Math.min(10, lesson.durationMinutes),
    activities: [
      ...lesson.activities,
      {
        id: `${lesson.slug}-reading`, type: 'READING', objectiveCode: lesson.objective.code,
        prompt: '读句子，选择正确的中文意思。',
        content: { japanese: readingExample.japanese, options: optionsFor(readingExample.chinese) },
        answer: { value: readingExample.chinese },
        explanation: `这句话的意思是「${readingExample.chinese}」。`,
      },
      {
        id: `${lesson.slug}-listening`, type: 'LISTENING_CHOICE', objectiveCode: lesson.objective.code,
        prompt: '听句子，选择正确的中文意思。',
        content: { audioText: listeningExample.japanese, options: optionsFor(listeningExample.chinese) },
        answer: { value: listeningExample.chinese },
        explanation: `听到的是「${listeningExample.japanese}」，意思是「${listeningExample.chinese}」。`,
      },
    ],
  };
}

export const N5_COURSE: CurriculumCourse = {
  ...CORE_COURSE,
  units: CORE_COURSE.units.map((unit) => ({ ...unit, lessons: [...unit.lessons.map((lesson) => expandCoreLesson(lesson, unit)), ...vocabularyLessons(unit.slug)] })),
};

export const TOTAL_VOCABULARY_TARGET = N5_COURSE.units.reduce(
  (total, unit) => total + unit.vocabularyTarget,
  0,
);

export const TOTAL_LESSONS = N5_COURSE.units.reduce(
  (total, unit) => total + unit.lessons.length,
  0,
);
