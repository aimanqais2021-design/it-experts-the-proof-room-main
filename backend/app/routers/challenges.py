from fastapi import APIRouter, HTTPException
from ..schemas import ChallengeSubmission

router = APIRouter(prefix="/api/challenges", tags=["Interactive Technical Challenges"])

CHALLENGES_DATA = [
    {
        "id": "challenge-python-debug",
        "domain_en": "Python & Backend Concurrency",
        "domain_ar": "تصحيح أخطاء بايثون والأداء",
        "title_en": "01 // Python Mutable Default Argument & Memory Leak Trap",
        "title_ar": "01 // فخ المعاملات الافتراضية القابلة للتعديل في بايثون",
        "scenario_en": "A student's telemetry aggregator keeps duplicating sensor readings across separate API requests:",
        "scenario_ar": "يعاني كود تجميع قراءات المستشعرات من تداخل البيانات وتراكمها عبر الطلبات المتتالية:",
        "code_snippet": (
            "def append_telemetry(reading: float, buffer: list = []):\n"
            "    buffer.append(reading)\n"
            "    return {'count': len(buffer), 'mean': sum(buffer) / len(buffer)}"
        ),
        "question_en": "Why does `append_telemetry(12.5)` return `count: 2` on the second independent request, and what is the production-grade fix?",
        "question_ar": "لماذا يعيد الاستدعاء الثاني المستقل للدالة `count: 2` بدلاً من `1`، وما هو الحل الهندسي الصحيح؟",
        "options": [
            {
                "id": "A",
                "text_en": "Python evaluates default parameters once at function definition time (`def`), sharing the same `list` object across all calls. Fix: use `buffer: Optional[list] = None` and initialize `buffer = []` inside the function.",
                "text_ar": "تقوم بايثون بتهيئة القائمة الافتراضية مرة واحدة فقط عند تعريف الدالة، مما يجعلها مشتركة بين كل الاستدعاءات. الحل: استخدام `buffer = None` وإنشاء قائمة جديدة داخل الدالة.",
            },
            {
                "id": "B",
                "text_en": "Python lists are global by default unless declared with the `nonlocal` keyword inside the function.",
                "text_ar": "قوائم بايثون تكون عامة افتراضياً ما لم يتم استخدام الكلمة المفتاحية `nonlocal`.",
            },
            {
                "id": "C",
                "text_en": "Floating-point division `sum(buffer) / len(buffer)` caches the list reference in CPU L1 cache.",
                "text_ar": "عملية القسمة العشرية تقوم بتخزين القائمة مؤقتاً في ذاكرة المعالج.",
            },
        ],
        "correct_option": "A",
        "explanation_en": "In Python, default argument expressions are evaluated once when the `def` statement is executed, not on each function call. Mutating `buffer` mutates the function's `__defaults__` tuple in-place. Initializing `if buffer is None: buffer = []` guarantees request isolation.",
        "explanation_ar": "في لغة بايثون يتم تقييم القيم الافتراضية للمعاملات مرة واحدة فقط عند تحميل الدالة في الذاكرة. لذلك فإن الإضافة إلى القائمة تعدل نفس الكائن المشترك. استخدام `None` كقيمة افتراضية يضمن عزل كل طلب بشكل مستقل.",
    },
    {
        "id": "challenge-sql-indexing",
        "domain_en": "Databases & Query Optimization",
        "domain_ar": "قواعد البيانات وتحسين استعلامات SQL",
        "title_en": "02 // Composite B-Tree Index Leftmost Prefix Rule",
        "title_ar": "02 // قاعدة البادئة اليسرى في فهارس B-Tree المركبة",
        "scenario_en": "A PostgreSQL table `leads` has 500,000 rows and a composite index:",
        "scenario_ar": "يحتوي جدول `leads` على 500,000 سجل مع الفهرس المركب التالي:",
        "code_snippet": (
            "CREATE INDEX idx_leads_status_cat_created\n"
            "ON leads (status, request_category, created_at DESC);\n\n"
            "-- Query Executed:\n"
            "SELECT id, reference_code FROM leads\n"
            "WHERE request_category = 'Computer Vision' AND status = 'NEW'\n"
            "ORDER BY created_at DESC LIMIT 20;"
        ),
        "question_en": "How will the PostgreSQL query planner execute this query?",
        "question_ar": "كيف سينفذ مخطط الاستعلام في PostgreSQL هذا الاستعلام؟",
        "options": [
            {
                "id": "A",
                "text_en": "It performs a full Sequential Table Scan because `request_category` appears before `status` in the `WHERE` clause.",
                "text_ar": "سيقوم بمسح كامل للجدول لأن ترتيب الشروط في `WHERE` مختلف عن ترتيب الفهرس.",
            },
            {
                "id": "B",
                "text_en": "The SQL optimizer reorders commutative `AND` predicates in `WHERE`. Since both leading columns (`status`, `request_category`) are equality-matched and `created_at DESC` matches the third key, it executes an ultra-fast Index Scan without an extra sort step.",
                "text_ar": "يقوم محسن الاستعلام بإعادة ترتيب شروط `AND` تلقائياً، وبما أن العمودين الأول والثاني موجودان مع ترتيب العمود الثالث، فسينفذ بحثاً سريعاً بالفهرس بدون الحاجة لعملية فرز إضافية.",
            },
            {
                "id": "C",
                "text_en": "B-Tree indexes cannot support `ORDER BY ... DESC` clauses without rebuilding the table.",
                "text_ar": "لا يمكن لفهارس B-Tree دعم الترتيب التنازلي `DESC` إطلاقاً.",
            },
        ],
        "correct_option": "B",
        "explanation_en": "Relational query optimizers canonicalize conjunctive (`AND`) equality predicates regardless of their written order in the `WHERE` clause. Because `status` and `request_category` are constrained by equality (`=`), the third index column `created_at DESC` is already in sorted order, eliminating an expensive in-memory `Sort` node.",
        "explanation_ar": "تتعامل محركات قواعد البيانات العلائقية مع شروط `AND` بمرونة بغض النظر عن ترتيب كتابتها في جملة `WHERE`. وبما أن العمود الأول والثاني في الفهرس محددان بعلامة المساواة، يتم استرجاع النتائج مرتبة جاهزة حسب `created_at DESC` بسرعة فائقة.",
    },
    {
        "id": "challenge-ai-classification",
        "domain_en": "Machine Learning & Medical AI",
        "domain_ar": "الذكاء الاصطناعي وتقييم النماذج",
        "title_en": "03 // The Class Imbalance Accuracy Paradox",
        "title_ar": "03 // مفارقة الدقة في البيانات غير المتوازنة",
        "scenario_en": "An anomaly detector inspects 10,000 network flows where 9,900 are benign and 100 are cyber-intrusions:",
        "scenario_ar": "يقوم نموذج ذكاء اصطناعي بفحص 10,000 تدفق شبكي (9,900 سليم و100 هجوم سيبراني):",
        "code_snippet": (
            "# Model Output on 10,000 Test Flows:\n"
            "True Negatives (Benign -> Benign): 9,900\n"
            "False Negatives (Attack -> Benign):  100\n"
            "True Positives (Attack -> Attack):     0\n"
            "Overall Accuracy = 99.0%"
        ),
        "question_en": "Why is this 99.0% accurate model completely useless in production, and which metric + loss adjustment fixes it?",
        "question_ar": "لماذا يعتبر هذا النموذج ذو الدقة 99.0% فاشلاً تماماً في الإنتاج، وما هو المقياس والمعالجة الصحيحة؟",
        "options": [
            {
                "id": "A",
                "text_en": "The model achieved 99% accuracy simply by predicting 'Benign' for every flow (Recall = 0%, F1 = 0.0). Fix: evaluate using Precision-Recall AUC / Macro-F1 and apply class-weighted focal loss or stratified resampling.",
                "text_ar": "حقق النموذج 99% لأنه يصنف كل شيء كحركة سليمة (الاستدعاء Recall = 0%). الحل: الاعتماد على مقياس F1-Score و PR-AUC مع موازنة أوزان الفئات أثناء التدريب.",
            },
            {
                "id": "B",
                "text_en": "Increase batch size to 10,000 and remove the validation split so accuracy reaches 100%.",
                "text_ar": "زيادة حجم الدفعة التدريبية وإلغاء بيانات الاختبار للوصول إلى دقة 100%.",
            },
            {
                "id": "C",
                "text_en": "Replace float32 weights with int8 quantization to increase True Positives.",
                "text_ar": "تقليص دقة الأوزان الرقمية لزيادة اكتشاف الهجمات.",
            },
        ],
        "correct_option": "A",
        "explanation_en": "On a 99:1 imbalanced dataset, a trivial constant classifier scores 99% accuracy while missing 100% of real attacks (Recall = 0%). Production AI systems at IT EXPERTS always report Precision, Recall, F1-Score, and ROC/PR-AUC alongside confusion matrices.",
        "explanation_ar": "في البيانات غير المتوازنة (99% مقابل 1%)، يمكن لنموذج بدائي أن يحقق دقة 99% عبر تجاهل الفئة النادرة تماماً. لذلك نعتمد في IT EXPERTS دائماً على مقاييس Recall و F1-Score ومصفوفة الارتباك.",
    },
    {
        "id": "challenge-networking-ospf",
        "domain_en": "Computer Networking & Routing",
        "domain_ar": "هندسة الشبكات وبروتوكولات التوجيه",
        "title_en": "04 // OSPF Link-State Cost vs. Hop-Count Routing (RIP)",
        "title_ar": "04 // توجيه OSPF المعتمد على التكلفة مقابل عدد القفزات",
        "scenario_en": "Packet routing between Core-GW1 and Cluster-AI has two candidate paths:",
        "scenario_ar": "يوجد مساران لنقل البيانات بين الموجه الرئيسي Core-GW1 وعنقود الذكاء الاصطناعي Cluster-AI:",
        "code_snippet": (
            "Path 1 (2 Hops): Core-GW1 --(10 Mbps Legacy Link, Cost=100)--> Edge-R1 --(10 Gbps, Cost=1)--> Cluster-AI\n"
            "Path 2 (3 Hops): Core-GW1 --(10 Gbps Fiber, Cost=2)--> Dist-B --(10 Gbps, Cost=2)--> Edge-R3 --(10 Gbps, Cost=2)--> Cluster-AI"
        ),
        "question_en": "Which path does OSPF select, and why does it outperform legacy RIP?",
        "question_ar": "أي مسار سيختاره بروتوكول OSPF، ولماذا يتفوق على بروتوكول RIP التقليدي؟",
        "options": [
            {
                "id": "A",
                "text_en": "OSPF selects Path 1 because 2 router hops is always faster than 3 router hops.",
                "text_ar": "يختار OSPF المسار الأول لأن قفزتين دائماً أسرع من ثلاث قفزات.",
            },
            {
                "id": "B",
                "text_en": "OSPF runs Dijkstra's shortest-path algorithm on cumulative bandwidth-derived link cost. It selects Path 2 (Total Cost = 6 vs. Path 1 Cost = 101), avoiding the 10 Mbps bottleneck that hop-count RIP would blindly choose.",
                "text_ar": "يطبق OSPF خوارزمية Dijkstra على مجموع تكلفة عرض النطاق، فيختار المسار الثاني (التكلفة = 6 مقابل 101 للمسار الأول)، متجنباً اختناق الرابط البطيء الذي يختاره RIP.",
            },
            {
                "id": "C",
                "text_en": "OSPF broadcasts full routing tables every 30 seconds over UDP port 520.",
                "text_ar": "يقوم OSPF ببث جدول التوجيه الكامل كل 30 ثانية عبر منفذ UDP 520.",
            },
        ],
        "correct_option": "B",
        "explanation_en": "RIP uses raw hop count and would route traffic across the congested 10 Mbps link (2 hops). OSPF weights edges inversely to interface bandwidth (`Reference Bandwidth / Interface Bandwidth`), choosing the 3-hop 10 Gbps fiber path with cumulative cost 6.",
        "explanation_ar": "يعتمد بروتوكول RIP القديم على عدد القفزات فقط فيقع في فخ الرابط البطيء. بينما يحسب OSPF تكلفة المسار بناءً على سرعة الروابط عبر خوارزمية Dijkstra فيختار مسار الألياف الضوعية السريع بتكلفة إجمالية 6.",
    },
    {
        "id": "challenge-algorithm-complexity",
        "domain_en": "Algorithms & Data Structures",
        "domain_ar": "الخوارزميات وهياكل البيانات",
        "title_en": "05 // Optimizing O(N²) Duplicate Transaction Detection to O(N)",
        "title_ar": "05 // تحسين تعقيد الخوارزمية من O(N²) إلى O(N)",
        "scenario_en": "A payment gateway checks 100,000 incoming transaction hashes for duplicates:",
        "scenario_ar": "تفحص بوابة دفع 100,000 معاملة مالية لاكتشاف المعاملات المكررة:",
        "code_snippet": (
            "# Legacy O(N^2) Implementation (Takes 14.2 seconds for N=100,000):\n"
            "duplicates = []\n"
            "for i in range(len(tx_hashes)):\n"
            "    if tx_hashes[i] in tx_hashes[:i]:  # Linear slice scan!\n"
            "        duplicates.append(tx_hashes[i])"
        ),
        "question_en": "Why does this freeze under high load, and how do we reduce runtime from 14.2s to <15ms?",
        "question_ar": "لماذا يتباطأ هذا الكود بشدة، وكيف نقلص زمن التنفيذ من 14.2 ثانية إلى أقل من 15 ملي ثانية؟",
        "options": [
            {
                "id": "A",
                "text_en": "`tx_hashes[:i]` allocates a new list slice and performs an O(i) linear scan on every iteration, totaling ~5 billion comparisons (`N(N-1)/2`). Fix: track seen hashes in a `set` (`O(1)` average hash-table lookup) for overall `O(N)` time.",
                "text_ar": "يقوم الكود بإنشاء شريحة قائمة جديدة وبحث خطي في كل دورة بإجمالي 5 مليارات مقارنة. الحل: استخدام بنية `set` التي توفر بحثاً فورياً `O(1)` ليصبح الزمن الكلي خطياً `O(N)`.",
            },
            {
                "id": "B",
                "text_en": "Convert the `for` loop into a recursive function without changing the list lookup.",
                "text_ar": "تحويل الحلقة التكرارية إلى دالة عودية (Recursion) مع الإبقاء على القائمة.",
            },
            {
                "id": "C",
                "text_en": "Sort the list inside the loop on every iteration using Bubble Sort.",
                "text_ar": "ترتيب القائمة داخل الحلقة في كل دورة باستخدام الترتيب الفقاعي.",
            },
        ],
        "correct_option": "A",
        "explanation_en": "Replacing linear list membership checks (`O(N)`) with a Python `set` hash table (`O(1)` amortized lookup) reduces 100,000 checks from `5 × 10⁹` operations to `10⁵` operations — executing in ~11 milliseconds.",
        "explanation_ar": "استبدال البحث الخطي داخل القائمة ببنية جدول التجزئة `set` يقلص عدد العمليات من 5 مليارات عملية إلى 100 ألف عملية فقط، مما يخفض وقت التنفيذ إلى نحو 11 ملي ثانية.",
    },
]


@router.get("")
def list_challenges():
    return CHALLENGES_DATA


@router.post("/verify")
def verify_challenge(submission: ChallengeSubmission):
    for ch in CHALLENGES_DATA:
        if ch["id"] == submission.challenge_id:
            is_correct = submission.selected_option.upper() == ch["correct_option"].upper()
            return {
                "challenge_id": ch["id"],
                "selected_option": submission.selected_option.upper(),
                "correct_option": ch["correct_option"],
                "is_correct": is_correct,
                "explanation_en": ch["explanation_en"],
                "explanation_ar": ch["explanation_ar"],
            }
    raise HTTPException(status_code=404, detail="Challenge ID not found.")
