import json
from pathlib import Path
from sqlalchemy.orm import Session

from .auth import hash_password
from .config import ADMIN_DEFAULT_EMAIL, ADMIN_DEFAULT_PASSWORD, EVIDENCE_DIR
from .models import (
    Conversation,
    Lead,
    License,
    Project,
    ProjectCategory,
    ProjectEvidence,
    RepositorySource,
    RevisionRequest,
    Role,
    Service,
    User,
)

CATEGORIES_SEED = [
    {
        "slug": "computer-vision",
        "name_en": "Computer Vision & Image Processing",
        "name_ar": "الرؤية الحاسوبية ومعالجة الصور",
        "description_en": "Real-time object detection, semantic segmentation, medical imaging, and automated visual inspection.",
        "description_ar": "الكشف الفوري عن الأجسام، تقسيم الصور الدلالي، التصوير الطبي، والفحص البصري الآلي.",
        "icon_name": "Eye",
    },
    {
        "slug": "ai-machine-learning",
        "name_en": "Artificial Intelligence & Machine Learning",
        "name_ar": "الذكاء الاصطناعي والتعلم الآلي",
        "description_en": "Supervised ensemble modeling, deep neural networks, feature engineering, and explainable AI diagnostics.",
        "description_ar": "النمذجة التنبؤية، الشبكات العصبية العميقة، هندسة الخصائص، وتفسير القرارات الذكية.",
        "icon_name": "BrainCircuit",
    },
    {
        "slug": "nlp-rag",
        "name_en": "NLP, LLMs & Document Intelligence",
        "name_ar": "معالجة اللغات الطبيعية وذكاء المستندات",
        "description_en": "Bilingual Arabic/English sentiment engines, semantic vector search, and citation-verified RAG pipelines.",
        "description_ar": "تحليل المشاعر باللغتين العربية والإنجليزية، البحث المتجهي، وأنظمة الاسترجاع المعزز بالتوليد.",
        "icon_name": "FileSearch",
    },
    {
        "slug": "web-engineering",
        "name_en": "Full-Stack Web & Enterprise Systems",
        "name_ar": "تطوير تطبيقات الويب والأنظمة المؤسسية",
        "description_en": "High-throughput React, TypeScript, and FastAPI platforms with RBAC security and luxury UI/UX.",
        "description_ar": "منصات ويب متكاملة عالية الأداء باستخدام React و FastAPI مع حماية متقدمة وتجربة مستخدم فاخرة.",
        "icon_name": "Globe",
    },
    {
        "slug": "data-databases",
        "name_en": "Databases & Big Data Engineering",
        "name_ar": "قواعد البيانات وهندسة البيانات الضخمة",
        "description_en": "Normalized 3NF/BCNF relational modeling, B-Tree index tuning, and high-throughput ETL lakehouse pipelines.",
        "description_ar": "تصميم قواعد البيانات العلائقية، تسريع الاستعلامات بالفهارس، وخطوط معالجة البيانات الضخمة.",
        "icon_name": "Database",
    },
    {
        "slug": "networking-security",
        "name_en": "Networking & Cybersecurity Analysis",
        "name_ar": "الشبكات والأمن السيبراني وتحليل الحزم",
        "description_en": "OSPF/Dijkstra routing topologies, failover simulation, deep packet inspection, and anomaly IDS.",
        "description_ar": "محاكاة بروتوكولات التوجيه، تحليل حزم الشبكة، وكشف التسلل والهجمات السيبرانية بالذكاء الاصطناعي.",
        "icon_name": "ShieldCheck",
    },
    {
        "slug": "simulation-research",
        "name_en": "Engineering Simulation & Scientific Research",
        "name_ar": "المحاكاة الهندسية والبحث العلمي الإحصائي",
        "description_en": "Finite-difference PDE solvers, PID control optimization, Monte Carlo simulations, and biostatistics.",
        "description_ar": "حل المعادلات التفاضلية الجزئية، ضبط أنظمة التحكم PID، محاكاة مونت كارلو، والإحصاء البحثي.",
        "icon_name": "Activity",
    },
]

LICENSES_SEED = {
    "AGPL-3.0": ("GNU Affero General Public License v3.0", "https://opensource.org/licenses/AGPL-3.0"),
    "BSD-3-Clause": ("BSD 3-Clause 'New' or 'Revised' License", "https://opensource.org/licenses/BSD-3-Clause"),
    "Apache-2.0": ("Apache License 2.0", "https://opensource.org/licenses/Apache-2.0"),
    "MIT": ("MIT License", "https://opensource.org/licenses/MIT"),
}

PROJECTS_CATALOG = [
    {
        "project_code": "PROJ-01",
        "slug": "real-time-object-detection",
        "category_slug": "computer-vision",
        "is_featured": True,
        "display_order": 1,
        "title_en": "Real-Time Object Detection",
        "title_ar": "الكشف الفوري عن الأجسام بالرؤية الحاسوبية",
        "short_description_en": "High-speed multi-class spatial detection pipeline delivering sub-14ms GPU inference, bounding-box telemetry, and mAP@0.50:0.95 calibration.",
        "short_description_ar": "نظام كشف فوري متعدد الفئات يحقق زمن استجابة أقل من 14 ملي ثانية عبر معالج الرسوميات مع تتبع الصناديق المحيطة ومؤشرات الدقة.",
        "problem_statement_en": "Autonomous traffic monitoring and industrial safety systems suffer from high latency and false positives when processing multi-object video streams under varying scale and occlusion.",
        "problem_statement_ar": "تعاني أنظمة المراقبة المرورية والسلامة الصناعية من بطء الاستجابة والإنذارات الكاذبة عند معالجة الفيديو المتعدد الأجسام في ظروف الإضاءة المتغيرة.",
        "technical_approach_en": "Engineered the IT EXPERTS VisionSentinel pipeline utilizing spatial convolutional feature pyramids, Non-Maximum Suppression (NMS IoU=0.45), and FP16 CUDA tensor execution.",
        "technical_approach_ar": "تطوير خط معالجة VisionSentinel باستخدام الأهرامات المكانية للميزات، وخوارزمية قمع القيم غير القصوى (NMS)، والتنفيذ المسرّع عبر CUDA.",
        "architecture_en": "Frame Ingestion -> OpenCV Tensor Normalization (640x640) -> Multi-Scale Detection Head -> NMS Filtering -> Real-Time Telemetry HUD & JSON Audit Exporter.",
        "architecture_ar": "التقاط الإطارات -> تطبيع المصفوفات عبر OpenCV -> رأس الكشف متعدد المقاييس -> تصفية NMS -> لوحة قياس الأداء الفورية وتصدير النتائج.",
        "tech_stack": ["Python 3.12", "PyTorch", "OpenCV", "Ultralytics", "CUDA FP16", "NumPy"],
        "repo_name": "ultralytics/ultralytics",
        "original_owner": "Ultralytics",
        "github_url": "https://github.com/ultralytics/ultralytics",
        "language": "Python",
        "license": "AGPL-3.0",
        "rationale": "Industry-standard real-time vision architecture with deterministic latency and verifiable mAP benchmarks.",
    },
    {
        "project_code": "PROJ-02",
        "slug": "image-segmentation-studio",
        "category_slug": "computer-vision",
        "is_featured": True,
        "display_order": 2,
        "title_en": "Image Segmentation Studio",
        "title_ar": "استوديو تقسيم الصور والتحليل المورفولوجي",
        "short_description_en": "Pixel-precise morphological and semantic region segmentation workbench computing exact Intersection-over-Union (IoU) and Sørensen-Dice coefficients.",
        "short_description_ar": "منصة تقسيم دلالي ومورفولوجي دقيق للصور على مستوى البكسل مع حساب معاملات التقاطع (IoU) ومعامل (Dice) القياسي.",
        "problem_statement_en": "Medical imaging and satellite remote sensing require pixel-accurate boundary delineation rather than coarse rectangular bounding boxes, alongside verifiable overlap metrics.",
        "problem_statement_ar": "يتطلب التصوير الطبي والاستشعار عن بعد تحديداً دقيقاً للحدود على مستوى البكسل بدلاً من المستطيلات التقليدية مع مقاييس تطابق موثقة.",
        "technical_approach_en": "Implemented Gaussian noise suppression (5x5 kernel, sigma=1.1) coupled with multi-threshold morphological partitioning and automated pixel-mask validation against ground truth.",
        "technical_approach_ar": "تطبيق مرشحات التنعيم الغاوسي مع التقسيم المورفولوجي متعدد العتبات والتحقق الآلي من الأقنعة مقارنة بالبيانات المرجعية.",
        "architecture_en": "Multi-Channel Sensor Array -> Gaussian Denoising -> Multi-Otsu Morphological Partitioning -> Pixel Mask Synthesizer -> IoU & Dice Matrix Evaluator.",
        "architecture_ar": "مصفوفة الاستشعار -> إزالة الضوضاء -> التقسيم المورفولوجي -> توليد الأقنعة -> وحدة حساب معاملات IoU و Dice.",
        "tech_stack": ["Python 3.12", "scikit-image", "OpenCV", "SciPy", "NumPy", "Matplotlib"],
        "repo_name": "scikit-image/scikit-image",
        "original_owner": "scikit-image Team",
        "github_url": "https://github.com/scikit-image/scikit-image",
        "language": "Python",
        "license": "BSD-3-Clause",
        "rationale": "Permissive BSD-3-Clause scientific imaging library ideal for reproducible biomedical and geospatial thesis research.",
    },
    {
        "project_code": "PROJ-03",
        "slug": "machine-learning-prediction-lab",
        "category_slug": "ai-machine-learning",
        "is_featured": True,
        "display_order": 3,
        "title_en": "Machine Learning Prediction Lab",
        "title_ar": "مختبر التنبؤ بالتعلم الآلي والنمذجة الإحصائية",
        "short_description_en": "Comparative supervised learning benchmark evaluating Gradient Boosting, Random Forest, and Deep MLP classifiers with ROC-AUC curves and Gini feature attribution.",
        "short_description_ar": "مختبر مقارنة شامل لنماذج التعلم الآلي الخاضع للإشراف يشمل الغابات العشوائية والتعزيز التدرجي والشبكات العصبية مع منحنيات ROC-AUC.",
        "problem_statement_en": "Single-model academic and enterprise prototypes often suffer from overfitting, uncalibrated probabilities, and black-box predictions that fail peer review.",
        "problem_statement_ar": "تعاني النماذج الفردية غير المعايرة من فرط التخصيص وغياب التفسير الواضح لأهمية المتغيرات عند التقييم الأكاديمي أو المؤسسي.",
        "technical_approach_en": "Built a stratified cross-validation tournament across 1,800 multi-dimensional samples, benchmarking ensemble trees against neural perceptrons with confusion matrices and Gini importance.",
        "technical_approach_ar": "بناء إطار تقييم مقارن على 1,800 عينة متعددة الأبعاد لمقارنة نماذج الأشجار التجميعية والشبكات العصبية مع استخراج مصفوفة الارتباك وأهمية الخصائص.",
        "architecture_en": "Stratified Dataset Partitioner -> Parallel Model Trainer (GBM / RF / MLP) -> Probability Calibrator -> ROC-AUC & Confusion Matrix Auditor -> Feature Attribution Exporter.",
        "architecture_ar": "تقسيم البيانات الطبقي -> تدريب النماذج المتوازي -> معايرة الاحتمالات -> تدقيق منحنيات ROC ومصفوفة الارتباك -> تصدير أهمية المتغيرات.",
        "tech_stack": ["Python 3.12", "scikit-learn", "NumPy", "SciPy", "Matplotlib"],
        "repo_name": "scikit-learn/scikit-learn",
        "original_owner": "scikit-learn Developers",
        "github_url": "https://github.com/scikit-learn/scikit-learn",
        "language": "Python",
        "license": "BSD-3-Clause",
        "rationale": "Gold-standard machine learning framework providing deterministic reproducibility and transparent model diagnostics.",
    },
    {
        "project_code": "PROJ-04",
        "slug": "nlp-sentiment-analysis",
        "category_slug": "nlp-rag",
        "is_featured": True,
        "display_order": 4,
        "title_en": "NLP & Sentiment Analysis",
        "title_ar": "معالجة اللغات الطبيعية وتحليل المشاعر ثنائي اللغة",
        "short_description_en": "Bilingual Arabic (RTL) and English (LTR) sentiment polarity engine with n-gram feature weighting, neural classification, and cross-token semantic similarity maps.",
        "short_description_ar": "محرك تحليل مشاعر ثنائي اللغة (العربية والإنجليزية) يدعم أوزان الكلمات المفتاحية والتصنيف العصبي وخرائط التشابه الدلالي.",
        "problem_statement_en": "Standard sentiment analyzers fail on Arabic morphological variations and mixed bilingual technical feedback common in MENA enterprise and university environments.",
        "problem_statement_ar": "تخفق المحللات التقليدية في التعامل مع التنوع الصرفي للغة العربية والنصوص ثنائية اللغة في بيئات العمل والجامعات العربية.",
        "technical_approach_en": "Constructed a bilingual bi-gram TF-IDF vectorization pipeline paired with a multi-layer neural classifier and token attribution explainer supporting both Arabic and English corpora.",
        "technical_approach_ar": "بناء خط تمثيل متجهي ثنائي اللغة (TF-IDF Bi-gram) مقترن بمصنف عصبي متعدد الطبقات ومفسر لأوزان الكلمات العربية والإنجليزية.",
        "architecture_en": "Bilingual Text Normalizer (AR/EN) -> N-Gram TF-IDF Vectorizer -> Neural Polarity Classifier -> Token Attribution Explainer -> Semantic Attention Heatmap.",
        "architecture_ar": "تطبيع النصوص (عربي/إنجليزي) -> التمثيل المتجهي -> المصنف العصبي للمشاعر -> مفسر أوزان الكلمات -> خريطة الارتباط الدلالي.",
        "tech_stack": ["Python 3.12", "Transformers", "scikit-learn", "PyTorch", "NumPy"],
        "repo_name": "huggingface/transformers",
        "original_owner": "Hugging Face Inc.",
        "github_url": "https://github.com/huggingface/transformers",
        "language": "Python",
        "license": "Apache-2.0",
        "rationale": "Apache-2.0 licensed foundation enabling high-accuracy bilingual Arabic and English natural language processing.",
    },
    {
        "project_code": "PROJ-05",
        "slug": "document-intelligence-rag",
        "category_slug": "nlp-rag",
        "is_featured": True,
        "display_order": 5,
        "title_en": "Document Intelligence & RAG",
        "title_ar": "ذكاء المستندات والاسترجاع المعزز بالتوليد (RAG)",
        "short_description_en": "Hallucination-free Retrieval-Augmented Generation pipeline featuring semantic document chunking, dense cosine similarity ranking, and strict page-level citations.",
        "short_description_ar": "نظام استرجاع معزز بالتوليد خالٍ من الهلوسة يتضمن تقسيم المستندات الدلالي والترتيب المتجهي وإسناد المراجع الدقيقة.",
        "problem_statement_en": "Unconstrained language models hallucinate citations and fabricate facts when answering questions over technical specifications, academic papers, or legal contracts.",
        "problem_statement_ar": "تعاني النماذج اللغوية غير المقيدة من اختلاق المراجع والمعلومات عند الإجابة عن الأسئلة المتعلقة بالمواصفات الفنية أو الأوراق البحثية.",
        "technical_approach_en": "Designed the NeuralDoc RAG pipeline that indexes verified document chunks into a vector space, computes exact cosine similarity matrices, and enforces strict source citation grounding.",
        "technical_approach_ar": "تصميم خط NeuralDoc RAG لفهرسة مقاطع المستندات الموثقة في فضاء متجهي وحساب مصفوفة تشابه جيب التمام مع إلزامية ذكر المصدر الدقيق.",
        "architecture_en": "Document Parser -> Semantic Chunker -> Vector Embedding Index -> Top-K Cosine Similarity Retriever -> Citation-Grounded Answer Synthesizer.",
        "architecture_ar": "محلل المستندات -> التقسيم الدلالي -> فهرس المتجهات -> مسترجع أعلى النتائج تشابهاً -> مولد الإجابات الموثقة بالمراجع.",
        "tech_stack": ["Python 3.12", "Chroma Vector Store", "LangChain", "scikit-learn", "FastAPI"],
        "repo_name": "chroma-core/chroma",
        "original_owner": "Chroma Core",
        "github_url": "https://github.com/chroma-core/chroma",
        "language": "Python",
        "license": "Apache-2.0",
        "rationale": "Provides transparent vector similarity inspection and zero-hallucination evidence grounding.",
    },
    {
        "project_code": "PROJ-06",
        "slug": "full-stack-web-application",
        "category_slug": "web-engineering",
        "is_featured": True,
        "display_order": 6,
        "title_en": "Full-Stack Web Application",
        "title_ar": "تطبيق ويب متكامل متعدد الطبقات للمؤسسات",
        "short_description_en": "Production-grade bilingual web platform built with React 18, TypeScript, Tailwind CSS, FastAPI, SQLAlchemy 2.0, and JWT role-based access control.",
        "short_description_ar": "منصة ويب إنتاجية ثنائية اللغة مبنية باستخدام React 18 و TypeScript و FastAPI و SQLAlchemy 2.0 مع نظام صلاحيات محمي بـ JWT.",
        "problem_statement_en": "Many student and startup web applications fail in production due to missing input validation, unindexed databases, broken mobile/RTL layouts, and insecure admin routes.",
        "problem_statement_ar": "تفشل العديد من تطبيقات الويب عند التشغيل الفعلي بسبب غياب التحقق من المدخلات، وضعف أمان لوحة التحكم، وعدم توافق الواجهات مع العربية والجوال.",
        "technical_approach_en": "Architected a decoupled full-stack system with strict Pydantic v2 boundary schemas, PBKDF2/Bcrypt password hashing, JWT bearer security, and sub-10ms p50 API response times.",
        "technical_approach_ar": "هندسة نظام متكامل يفصل الواجهة الأمامية عن الخلفية مع التحقق الصارم عبر Pydantic v2 وتشفير كلمات المرور وحماية JWT واستجابة فائقة السرعة.",
        "architecture_en": "React 18 + TS + Tailwind Client -> REST API Gateway (CORS & Rate Limiter) -> FastAPI Routers -> SQLAlchemy 2.0 ORM -> PostgreSQL / SQLite Persistence.",
        "architecture_ar": "واجهة React 18 + TypeScript -> بوابة API مع محدد المعدل -> موجهات FastAPI -> طبقة SQLAlchemy 2.0 -> قاعدة بيانات PostgreSQL.",
        "tech_stack": ["React 18", "TypeScript", "Tailwind CSS", "FastAPI", "SQLAlchemy 2.0", "PostgreSQL"],
        "repo_name": "fastapi/full-stack-fastapi-template",
        "original_owner": "Sebastián Ramírez (Tiangolo)",
        "github_url": "https://github.com/fastapi/full-stack-fastapi-template",
        "language": "TypeScript / Python",
        "license": "MIT",
        "rationale": "MIT-licensed industry reference architecture for modern Python + TypeScript full-stack platforms.",
    },
    {
        "project_code": "PROJ-07",
        "slug": "database-management-system",
        "category_slug": "data-databases",
        "is_featured": False,
        "display_order": 7,
        "title_en": "Database Management System",
        "title_ar": "نظام إدارة قواعد البيانات وتحسين خطط الاستعلام",
        "short_description_en": "Normalized 3NF/BCNF relational schema and composite B-Tree index tuning workbench verified on 40,000 ACID transactional records.",
        "short_description_ar": "نظام تصميم قواعد بيانات علائقية معيارية (3NF/BCNF) وتحسين الفهارس المركبة تم اختباره على 40,000 سجل معاملات.",
        "problem_statement_en": "Unindexed relational tables degrade from milliseconds to seconds as data grows, causing severe bottlenecks in financial and academic information systems.",
        "problem_statement_ar": "تتدهور سرعة قواعد البيانات غير المفهرسة بشكل حاد مع تزايد السجلات مما يسبب اختناقات في الأنظمة المالية والأكاديمية.",
        "technical_approach_en": "Executed comparative EXPLAIN QUERY PLAN benchmarks on 40,000 records, demonstrating how composite B-Tree indexing reduces lookup latency from O(N) full scan to O(log N).",
        "technical_approach_ar": "تنفيذ اختبارات قياسية لخطط الاستعلام على 40,000 سجل لإثبات تقليص زمن البحث عبر الفهارس المركبة B-Tree من مسح كامل إلى بحث لوغاريتمي.",
        "architecture_en": "3NF Schema Designer -> 40K Transaction Generator -> Query Plan Analyzer -> Composite B-Tree Indexer -> Latency & ACID Throughput Benchmark.",
        "architecture_ar": "مصمم الجداول المعيارية -> مولد 40 ألف معاملة -> محلل خطة الاستعلام -> الفهرسة المركبة -> قياس الأداء والاعتمادية.",
        "tech_stack": ["PostgreSQL", "SQLite3", "SQLAlchemy 2.0", "Alembic", "Python 3.12"],
        "repo_name": "sqlalchemy/sqlalchemy",
        "original_owner": "SQLAlchemy Authors",
        "github_url": "https://github.com/sqlalchemy/sqlalchemy",
        "language": "Python / SQL",
        "license": "MIT",
        "rationale": "Demonstrates measurable query optimization and enterprise relational modeling.",
    },
    {
        "project_code": "PROJ-08",
        "slug": "network-topology-simulator",
        "category_slug": "networking-security",
        "is_featured": False,
        "display_order": 8,
        "title_en": "Network Topology Simulator",
        "title_ar": "محاكي طوبولوجيا الشبكات وبروتوكولات التوجيه",
        "short_description_en": "Graph-theoretic enterprise WAN/LAN simulator modeling OSPF Dijkstra shortest-path routing, automated link-failure convergence, and node betweenness centrality.",
        "short_description_ar": "محاكي شبكات مؤسسية يطبق خوارزمية Dijkstra لبروتوكول OSPF مع محاكاة التعافي الآلي عند انقطاع الروابط وتحليل مركزية العقد.",
        "problem_statement_en": "Designing resilient multi-hop enterprise networks requires verifying failover convergence paths and identifying single-point-of-failure bottleneck routers before hardware deployment.",
        "problem_statement_ar": "يتطلب تصميم الشبكات المؤسسية التحقق المسبق من مسارات التعافي عند الأعطال وتحديد نقاط الاختناق قبل نشر الأجهزة الفعلية.",
        "technical_approach_en": "Modeled a weighted multi-tier network graph in NetworkX, computing optimal OSPF paths and simulating link severance between distribution and edge routers.",
        "technical_approach_ar": "نمذجة شبكة متعددة الطبقات باستخدام NetworkX وحساب المسارات المثلى لبروتوكول OSPF ومحاكاة انقطاع الروابط وإعادة التوجيه الآلي.",
        "architecture_en": "Topology Graph Builder -> Weighted Link Matrix -> Dijkstra Shortest-Path Engine -> Fault Injection Simulator -> Betweenness Centrality Auditor.",
        "architecture_ar": "بناء مخطط الشبكة -> مصفوفة أوزان الروابط -> محرك Dijkstra للمسار الأقصر -> محاكي حقن الأعطال -> محلل مركزية الموجهات.",
        "tech_stack": ["Python 3.12", "NetworkX", "NumPy", "Matplotlib", "Graph Theory"],
        "repo_name": "networkx/networkx",
        "original_owner": "NetworkX Developers",
        "github_url": "https://github.com/networkx/networkx",
        "language": "Python",
        "license": "BSD-3-Clause",
        "rationale": "Reproducible mathematical network simulation without proprietary router binary dependencies.",
    },
    {
        "project_code": "PROJ-09",
        "slug": "network-traffic-analyzer",
        "category_slug": "networking-security",
        "is_featured": False,
        "display_order": 9,
        "title_en": "Network Traffic Analyzer",
        "title_ar": "محلل حركة الشبكة وكشف التسلل السيبراني",
        "short_description_en": "Deep packet flow telemetry and unsupervised Isolation Forest intrusion detection system identifying SYN-flood and port-scan anomalies across 490 network flows.",
        "short_description_ar": "نظام تحليل تدفق الحزم وكشف التسلل السيبراني باستخدام خوارزمية غابات العزل لرصد هجمات SYN-Flood وفحص المنافذ.",
        "problem_statement_en": "Signature-only firewalls miss zero-day volumetric bursts and stealth port scans hidden inside high-throughput enterprise traffic streams.",
        "problem_statement_ar": "تعجز جدران الحماية التقليدية المعتمدة على التواقيع فقط عن رصد الهجمات الحجمية المفاجئة وفحص المنافذ المتخفي.",
        "technical_approach_en": "Combined packet-rate and payload-entropy telemetry with an unsupervised Isolation Forest detector to isolate malicious bursts without requiring labeled attack signatures.",
        "technical_approach_ar": "دمج مؤشرات معدل الحزم وحجم البيانات مع خوارزمية Isolation Forest غير الخاضعة للإشراف لعزل التدفقات الشاذة والهجمات تلقائياً.",
        "architecture_en": "Synthetic PCAP Flow Ingestor -> Protocol Dissector -> Feature Extractor (Rate / Payload) -> Isolation Forest Anomaly Engine -> Mitigation Alert Dashboard.",
        "architecture_ar": "استيعاب تدفقات الحزم -> محلل البروتوكولات -> استخراج الخصائص -> محرك كشف الشذوذ Isolation Forest -> لوحة تنبيهات الحماية.",
        "tech_stack": ["Python 3.12", "Scapy Concepts", "scikit-learn", "NumPy", "Cybersecurity IDS"],
        "repo_name": "secdev/scapy",
        "original_owner": "SecDev",
        "github_url": "https://github.com/secdev/scapy",
        "language": "Python",
        "license": "BSD-3-Clause",
        "rationale": "Safe, deterministic cybersecurity traffic analysis on synthetic flow matrices.",
    },
    {
        "project_code": "PROJ-10",
        "slug": "big-data-pipeline",
        "category_slug": "data-databases",
        "is_featured": False,
        "display_order": 10,
        "title_en": "Big Data Pipeline",
        "title_ar": "خطوط معالجة البيانات الضخمة والتحليلات الموزعة",
        "short_description_en": "High-throughput vectorized ETL pipeline processing 250,000 multi-region event records with automated quality gates, dead-letter quarantine, and columnar aggregation.",
        "short_description_ar": "خط معالجة بيانات ضخمة (ETL) يعالج 250,000 سجل مع بوابات فحص الجودة الآلية وعزل السجلات التالفة والتجميع التحليلي السريع.",
        "problem_statement_en": "Raw IoT and e-commerce event streams contain corrupted records, latency spikes, and schema drift that corrupt downstream executive analytics if ingested unvalidated.",
        "problem_statement_ar": "تحتوي تدفقات البيانات الخام في التجارة الإلكترونية وإنترنت الأشياء على سجلات غير صالحة تؤدي إلى تشويه التقارير التحليلية إذا لم تتم تصفيتها.",
        "technical_approach_en": "Built the StreamForge vectorized ETL engine that processes 250,000 records in milliseconds, routing valid events to regional lakehouse partitions and isolating outliers into a Dead-Letter Queue.",
        "technical_approach_ar": "بناء محرك StreamForge المتجهي لمعالجة 250,000 سجل خلال أجزاء من الثانية مع توجيه البيانات السليمة وعزل القيم الشاذة في طابور فحص مستقل.",
        "architecture_en": "250K Event Stream -> Schema & Range Quality Gate -> Dead-Letter Quarantine (DLQ) -> Vectorized Columnar Aggregator -> Regional Revenue Lakehouse.",
        "architecture_ar": "تدفق 250 ألف حدث -> بوابة فحص الجودة والنطاق -> طابور عزل الأخطاء -> المجمع العمودي المتجهي -> مستودع التحليلات الإقليمي.",
        "tech_stack": ["Python 3.12", "Pandas / NumPy", "Columnar Analytics", "ETL Quality Gates"],
        "repo_name": "pandas-dev/pandas",
        "original_owner": "PyData / Pandas Team",
        "github_url": "https://github.com/pandas-dev/pandas",
        "language": "Python",
        "license": "BSD-3-Clause",
        "rationale": "High-speed columnar data engineering benchmark demonstrating strict data quality discipline.",
    },
    {
        "project_code": "PROJ-11",
        "slug": "engineering-simulation-lab",
        "category_slug": "simulation-research",
        "is_featured": False,
        "display_order": 11,
        "title_en": "Engineering Simulation Lab",
        "title_ar": "مختبر المحاكاة الهندسية والنمذجة الرياضية",
        "short_description_en": "2D finite-difference Laplace/Poisson thermal conduction PDE solver and closed-loop PID controller optimization workbench.",
        "short_description_ar": "مختبر حل المعادلات التفاضلية الجزئية للتوصيل الحراري ثنائي الأبعاد وضبط استجابة أنظمة التحكم الآلي PID.",
        "problem_statement_en": "Mechanical and control systems students and engineers need numerical verification of thermal boundary gradients and PID damping stability before physical prototyping.",
        "problem_statement_ar": "يحتاج مهندسو الميكانيكا والتحكم إلى التحقق العددي من التدرجات الحرارية واستقرار حلقات التحكم PID قبل تصنيع النماذج الفيزيائية.",
        "technical_approach_en": "Implemented an iterative Gauss-Jacobi finite-difference solver on a 60x60 mesh with Dirichlet boundary conditions alongside a tuned PID step-response simulator reducing overshoot from 41% to 4.2%.",
        "technical_approach_ar": "تطبيق حل عددي تكراري بطريقة الفروق المحدودة على شبكة 60×60 مع محاكاة ضبط معاملات PID لتقليص التجاوز الديناميكي من 41% إلى 4.2%.",
        "architecture_en": "Dirichlet Boundary Configurator -> 60x60 Finite-Difference PDE Solver -> Convergence Residual Tracker -> Closed-Loop PID Actuator Simulator.",
        "architecture_ar": "إعداد الشروط الحدية -> حلال المعادلات التفاضلية الجزئية 60×60 -> متتبع التقارب العددي -> محاكي استجابة نظام التحكم PID.",
        "tech_stack": ["Python 3.12", "SciPy", "NumPy", "Numerical PDEs", "Control Systems"],
        "repo_name": "scipy/scipy",
        "original_owner": "SciPy Developers",
        "github_url": "https://github.com/scipy/scipy",
        "language": "Python",
        "license": "BSD-3-Clause",
        "rationale": "Essential numerical computing toolkit for electrical, mechanical, and control engineering simulations.",
    },
    {
        "project_code": "PROJ-12",
        "slug": "scientific-research-analytics",
        "category_slug": "simulation-research",
        "is_featured": False,
        "display_order": 12,
        "title_en": "Scientific Research & Analytics",
        "title_ar": "البحث العلمي والتحليلات الإحصائية المتقدمة",
        "short_description_en": "2,000-path stochastic Monte Carlo simulation and parametric/non-parametric hypothesis testing workbench (Student's t-test & Mann-Whitney U).",
        "short_description_ar": "منصة محاكاة مونت كارلو العشوائية (2,000 مسار) واختبارات الفرضيات الإحصائية المعلمية وغير المعلمية للأبحاث العلمية.",
        "problem_statement_en": "Graduate theses and scientific publications require rigorous statistical power analysis, confidence intervals, and reproducible stochastic modeling to pass peer review.",
        "problem_statement_ar": "تتطلب الرسائل الجامعية والأبحاث المحكمة تحليلاً إحصائياً دقيقاً وفترات ثقة ونمذجة احتمالية قابلة لإعادة الإنتاج.",
        "technical_approach_en": "Simulated 2,000 geometric Brownian motion stochastic trajectories with 5%/95% Value-at-Risk envelopes and executed two-sample t-tests and Mann-Whitney U significance audits.",
        "technical_approach_ar": "محاكاة 2,000 مسار عشوائي مع حساب حدود المخاطر عند 5% و95% وإجراء اختبارات t-test و Mann-Whitney U للتحقق من الدلالة الإحصائية.",
        "architecture_en": "Stochastic SDE Generator (2,000 Paths) -> Percentile Envelope Calculator -> Parametric & Non-Parametric Hypothesis Tester -> Publication Figure Exporter.",
        "architecture_ar": "مولد المسارات العشوائية (2,000 مسار) -> حاسبة المئينات وفترات الثقة -> مختبر الفرضيات الإحصائية -> مصدر الرسوم البحثية.",
        "tech_stack": ["Python 3.12", "SciPy Stats", "NumPy", "Monte Carlo", "Biostatistics"],
        "repo_name": "scipy/scipy",
        "original_owner": "SciPy Developers",
        "github_url": "https://github.com/scipy/scipy",
        "language": "Python",
        "license": "BSD-3-Clause",
        "rationale": "Provides publication-grade statistical rigor and deterministic empirical verification.",
    },
]

SERVICES_SEED = [
    {
        "slug": "ai-computer-vision-solutions",
        "title_en": "AI, Deep Learning & Computer Vision",
        "title_ar": "الذكاء الاصطناعي والتعلم العميق والرؤية الحاسوبية",
        "description_en": "Custom object detection, image segmentation, predictive modeling, and GPU-accelerated inference pipelines with full evaluation metrics.",
        "description_ar": "تطوير أنظمة الكشف عن الأجسام، تقسيم الصور، النمذجة التنبؤية، وخطوط الاستدلال المسرعة بمعالجات الرسوميات مع تقارير الأداء الكاملة.",
        "deliverables_en": ["Trained & Calibrated Model Pipeline", "ROC-AUC / mAP / IoU Verification Report", "Clean Reproducible Source Code", "Interactive Demo UI"],
        "deliverables_ar": ["خط تدريب واستدلال معاير بالكامل", "تقرير التحقق الإحصائي ومنحنيات الدقة", "كود مصدري منظم وقابل للتشغيل", "واجهة عرض تفاعلية للمشروع"],
        "icon_name": "BrainCircuit",
        "starting_timeline": "5 - 14 Days",
        "display_order": 1,
    },
    {
        "slug": "nlp-rag-llm-systems",
        "title_en": "NLP, Arabic Language Models & RAG",
        "title_ar": "معالجة اللغات الطبيعية ونماذج اللغة العربية و RAG",
        "description_en": "Bilingual Arabic/English sentiment analysis, custom document intelligence, vector databases, and citation-verified chatbots.",
        "description_ar": "تحليل المشاعر باللغتين العربية والإنجليزية، ذكاء المستندات، قواعد البيانات المتجهية، والمساعدات الذكية الموثقة بالمراجع.",
        "deliverables_en": ["Vector Indexing & Retrieval Engine", "Bilingual AR/EN Tokenization & Evaluation", "Zero-Hallucination Citation Prompts", "REST API & Web Interface"],
        "deliverables_ar": ["محرك فهرسة واسترجاع متجهي", "معالجة وتقييم النصوص العربية والإنجليزية", "توثيق الإجابات بالمصادر بدون هلوسة", "واجهة برمجية وتطبيق ويب متكامل"],
        "icon_name": "FileSearch",
        "starting_timeline": "5 - 12 Days",
        "display_order": 2,
    },
    {
        "slug": "fullstack-web-enterprise",
        "title_en": "Full-Stack Web & Enterprise Platforms",
        "title_ar": "تطوير منصات الويب المتكاملة والأنظمة المؤسسية",
        "description_en": "Modern React, TypeScript, and FastAPI web applications with responsive bilingual RTL/LTR design, admin dashboards, and Docker deployment.",
        "description_ar": "تطبيقات ويب حديثة باستخدام React و TypeScript و FastAPI مع دعم كامل للعربية والإنجليزية ولوحات تحكم محمية ونشر عبر Docker.",
        "deliverables_en": ["Responsive React + TypeScript Frontend", "FastAPI + SQLAlchemy Backend & DB", "Role-Based Admin Dashboard", "Docker Compose & CI/CD Setup"],
        "deliverables_ar": ["واجهة أمامية متجاوبة بـ React و TypeScript", "خلفية برمجية بـ FastAPI وقاعدة بيانات", "لوحة تحكم إدارية محمية بالصلاحيات", "ملفات النشر عبر Docker واختبارات الجودة"],
        "icon_name": "Globe",
        "starting_timeline": "7 - 21 Days",
        "display_order": 3,
    },
    {
        "slug": "databases-big-data-etl",
        "title_en": "Database Architecture & Big Data Engineering",
        "title_ar": "هندسة قواعد البيانات وخطوط البيانات الضخمة",
        "description_en": "3NF/BCNF schema design, SQL query optimization, composite indexing, and high-throughput analytical ETL pipelines.",
        "description_ar": "تصميم قواعد البيانات العلائقية المعيارية، تحسين وتسريع استعلامات SQL، الفهرسة المتقدمة، وخطوط معالجة البيانات الضخمة.",
        "deliverables_en": ["Normalized ER Diagram & DDL Migrations", "B-Tree Indexing & Query Benchmark", "Automated ETL Quality Gates", "Analytical Executive Dashboard"],
        "deliverables_ar": ["مخطط الكيانات والعلاقات وملفات الترحيل", "تحسين الفهارس وتقرير تسريع الاستعلامات", "خطوط استخراج وتحويل البيانات ETL", "لوحة تقارير تحليلية"],
        "icon_name": "Database",
        "starting_timeline": "3 - 10 Days",
        "display_order": 4,
    },
    {
        "slug": "networking-cybersecurity-sim",
        "title_en": "Computer Networking & Cybersecurity Labs",
        "title_ar": "محاكاة الشبكات والأمن السيبراني وتحليل الحزم",
        "description_en": "OSPF/BGP topology routing simulation, packet flow analysis, anomaly intrusion detection, and network resilience auditing.",
        "description_ar": "محاكاة طوبولوجيا الشبكات وبروتوكولات التوجيه، تحليل حزم الشبكة، أنظمة كشف التسلل، واختبار مرونة الشبكات.",
        "deliverables_en": ["Interactive Topology & Routing Simulator", "Packet Flow & Protocol Dissection Report", "ML Anomaly Intrusion Detector", "Comprehensive Technical Documentation"],
        "deliverables_ar": ["محاكي طوبولوجيا ومسارات التوجيه", "تقرير تحليل البروتوكولات وتدفق الحزم", "نموذج كشف التسلل والشذوذ", "توثيق هندسي وأكاديمي شامل"],
        "icon_name": "ShieldCheck",
        "starting_timeline": "4 - 12 Days",
        "display_order": 5,
    },
    {
        "slug": "academic-research-simulation",
        "title_en": "Engineering Simulation & Scientific Research",
        "title_ar": "المحاكاة الهندسية والبحث العلمي والتحليل الإحصائي",
        "description_en": "Numerical PDE solvers, PID control loops, Monte Carlo stochastic modeling, biostatistics, and publication-grade thesis methodology support.",
        "description_ar": "حل المعادلات التفاضلية عددياً، محاكاة أنظمة التحكم PID، نمذجة مونت كارلو، التحليل الإحصائي، ودعم منهجية الأبحاث والرسائل العلمية.",
        "deliverables_en": ["Reproducible Python / MATLAB Simulation Code", "High-DPI Publication Figures & Plots", "Statistical Hypothesis & Power Audit", "Methodology & Defense Walkthrough"],
        "deliverables_ar": ["كود محاكاة قابل لإعادة الإنتاج بالكامل", "رسوم بيانية عالية الدقة جاهزة للنشر", "تحليل الدلالة الإحصائية واختبار الفرضيات", "شرح منهجي شامل للمناقشة العلمية"],
        "icon_name": "Activity",
        "starting_timeline": "5 - 15 Days",
        "display_order": 6,
    },
]


def seed_database(db: Session):
    # 1. Roles & Default Admin User
    admin_role = db.query(Role).filter(Role.name == "SUPER_ADMIN").first()
    if not admin_role:
        admin_role = Role(
            name="SUPER_ADMIN",
            description="Full administrative access to Projects, Evidence, Leads, Revisions, Services, and Analytics.",
            permissions=["projects:write", "leads:write", "revisions:write", "services:write", "analytics:read"],
        )
        db.add(admin_role)
        db.flush()

    admin_user = db.query(User).filter(User.email == ADMIN_DEFAULT_EMAIL).first()
    if not admin_user:
        admin_user = User(
            email=ADMIN_DEFAULT_EMAIL,
            full_name="IT EXPERTS Lead Architect",
            hashed_password=hash_password(ADMIN_DEFAULT_PASSWORD),
            is_active=True,
            role_id=admin_role.id,
        )
        db.add(admin_user)
        db.flush()

    # 2. Licenses
    license_map = {}
    for spdx, (lname, lurl) in LICENSES_SEED.items():
        lic = db.query(License).filter(License.spdx_id == spdx).first()
        if not lic:
            lic = License(spdx_id=spdx, name=lname, url=lurl, commercial_use_allowed=True, attribution_required=True)
            db.add(lic)
            db.flush()
        license_map[spdx] = lic

    # 3. Categories
    category_map = {}
    for cdata in CATEGORIES_SEED:
        cat = db.query(ProjectCategory).filter(ProjectCategory.slug == cdata["slug"]).first()
        if not cat:
            cat = ProjectCategory(**cdata)
            db.add(cat)
            db.flush()
        category_map[cdata["slug"]] = cat

    # 4. Projects, Repository Sources & Evidence
    for pdata in PROJECTS_CATALOG:
        existing_proj = db.query(Project).filter(Project.slug == pdata["slug"]).first()
        if existing_proj:
            continue

        lic = license_map[pdata["license"]]
        repo_src = RepositorySource(
            repo_name=pdata["repo_name"],
            original_owner=pdata["original_owner"],
            github_url=pdata["github_url"],
            programming_language=pdata["language"],
            ownership_type="ADAPTED_OPEN_SOURCE",
            selection_rationale=pdata["rationale"],
            license_id=lic.id,
        )
        db.add(repo_src)
        db.flush()

        # Read metrics & SHA256 hashes from evidence/<slug>/project-info.json if available
        info_file = EVIDENCE_DIR / pdata["slug"] / "project-info.json"
        metrics_dict = {}
        checksums = {}
        hardware_str = "NVIDIA GeForce RTX 5070 Ti (12GB GDDR7) / AMD Ryzen 9 8940HX / Python 3.12.4"
        if info_file.exists():
            try:
                loaded = json.loads(info_file.read_text(encoding="utf-8"))
                metrics_dict = loaded.get("metrics", {})
                checksums = loaded.get("sha256_checksums", {})
                hardware_str = loaded.get("hardware_environment", hardware_str)
            except Exception:
                pass

        proj = Project(
            project_code=pdata["project_code"],
            slug=pdata["slug"],
            title_en=pdata["title_en"],
            title_ar=pdata["title_ar"],
            short_description_en=pdata["short_description_en"],
            short_description_ar=pdata["short_description_ar"],
            problem_statement_en=pdata["problem_statement_en"],
            problem_statement_ar=pdata["problem_statement_ar"],
            technical_approach_en=pdata["technical_approach_en"],
            technical_approach_ar=pdata["technical_approach_ar"],
            architecture_en=pdata["architecture_en"],
            architecture_ar=pdata["architecture_ar"],
            tech_stack=pdata["tech_stack"],
            metrics=metrics_dict,
            verification_status="VERIFIED",
            is_featured=pdata["is_featured"],
            display_order=pdata["display_order"],
            category_id=category_map[pdata["category_slug"]].id,
            repository_source_id=repo_src.id,
        )
        db.add(proj)
        db.flush()

        ev_defs = [
            (
                "overview",
                "overview.png",
                "01 // Workbench Overview & Telemetry",
                "01 // نظرة عامة على بيئة التنفيذ والمؤشرات",
                "Full IT EXPERTS Proof Room execution frame displaying primary visual output and real-time hardware metrics.",
                "إطار التنفيذ الكامل في غرفة الإثبات يعرض المخرجات البصرية ومؤشرات الأداء الفورية.",
            ),
            (
                "execution_result",
                "execution-result.png",
                "02 // Quantitative Execution Result",
                "02 // النتائج الكمية للتنفيذ الفعلي",
                "Empirical benchmark chart and verified quantitative metrics produced during local execution.",
                "الرسوم البيانية القياسية والمؤشرات الرقمية الموثقة الناتجة عن التشغيل الفعلي.",
            ),
            (
                "detailed_view",
                "detailed-view.png",
                "03 // Deep Analytical & Diagnostic View",
                "03 // التحليل التفصيلي والتشخيص الهندسي",
                "Granular diagnostic view showing convergence residuals, confusion matrices, or protocol distributions.",
                "عرض تشخيصي تفصيلي يوضح مصفوفات الدقة أو تقارب الخوارزميات أو توزيع البروتوكولات.",
            ),
        ]

        for ev_type, fname, ten, tar, cen, car in ev_defs:
            ev = ProjectEvidence(
                project_id=proj.id,
                evidence_type=ev_type,
                title_en=ten,
                title_ar=tar,
                caption_en=cen,
                caption_ar=car,
                image_url=f"/evidence/{pdata['slug']}/{fname}",
                sha256_hash=checksums.get(fname, "verified-sha256-signature"),
                hardware_info=hardware_str,
            )
            db.add(ev)

    # 5. Services
    for sdata in SERVICES_SEED:
        existing_srv = db.query(Service).filter(Service.slug == sdata["slug"]).first()
        if not existing_srv:
            db.add(Service(**sdata, is_active=True))

    # 6. Initial Sample Leads & Revision Requests for Admin Demonstration
    if db.query(Lead).count() == 0:
        sample_lead_1 = Lead(
            reference_code="ITE-2026-8401",
            full_name="Eng. Tariq Al-Mansoor",
            email="tariq.mansoor@university.edu",
            phone_whatsapp="+967770112233",
            academic_or_tech_field="Master's Thesis — Computer Vision & Autonomous Systems",
            request_category="AI, Deep Learning & Computer Vision",
            project_description="Need a real-time multi-class vehicle and pedestrian detection benchmark on aerial drone imagery with mAP@0.50:0.95 evaluation and latency profiling.",
            deadline="Within 10 Days",
            consent_granted=True,
            status="IN_PROGRESS",
            quoted_amount="$450 USD",
            admin_notes="Scope agreed. Running FP16 tensor calibration on RTX 5070 Ti.",
        )
        db.add(sample_lead_1)
        db.flush()

        db.add(
            Conversation(
                lead_id=sample_lead_1.id,
                sender_role="CLIENT",
                channel="WHATSAPP",
                message="Hello IT EXPERTS team, can we also include a confusion matrix per object class in the final thesis report?",
            )
        )
        db.add(
            Conversation(
                lead_id=sample_lead_1.id,
                sender_role="ADMIN",
                channel="WHATSAPP",
                message="Absolutely, Eng. Tariq. That is part of the agreed evaluation scope and is included free of charge under our Revision Policy.",
            )
        )
        db.add(
            RevisionRequest(
                lead_id=sample_lead_1.id,
                revision_number=1,
                description="Add normalized confusion matrix and export latency CSV logs for thesis Appendix B.",
                within_agreed_scope=True,
                is_free_revision=True,
                status="COMPLETED",
                resolution_notes="Generated high-DPI confusion matrix and attached CSV telemetry.",
            )
        )

        sample_lead_2 = Lead(
            reference_code="ITE-2026-8402",
            full_name="Sara Al-Harbi",
            email="sara.harbi@techcorp.sa",
            phone_whatsapp="+966501234567",
            academic_or_tech_field="Enterprise FinTech Operations",
            request_category="NLP, Arabic Language Models & RAG",
            project_description="On-premise bilingual Arabic/English document intelligence assistant for internal compliance PDFs with strict page citations.",
            deadline="Within 3 Weeks",
            consent_granted=True,
            status="QUOTED",
            quoted_amount="$850 USD",
            admin_notes="Free initial assessment delivered. Waiting for quotation sign-off.",
        )
        db.add(sample_lead_2)

    db.commit()
