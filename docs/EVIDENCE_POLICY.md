# Evidence Verification & Screenshot Integrity Policy
**Platform**: IT EXPERTS — THE PROOF ROOM  
**Document ID**: `ITE-POL-EVIDENCE-2026`  

---

## 1. Core Principle: Zero Fake Evidence

The foundational promise of **IT EXPERTS — THE PROOF ROOM** is:
> *"DON'T TAKE OUR WORD FOR IT. SEE WHAT WE CAN BUILD."*

Accordingly, every project exhibited in The Proof Room must be backed by genuine, reproducible execution output and authentic screenshot captures.

### Strictly Prohibited Practices:
- **No AI-Generated Concept Art**: Never use Midjourney, DALL-E, or diffusion-generated mockups as "screenshots" of software or algorithms.
- **No Unexecuted Claims**: Never mark a project as `VERIFIED` unless its code has been executed and its output artifacts validated by `scripts/validate_projects.py`.
- **No Credential or PII Exposure**: Never capture screenshots containing API keys, `.env` secrets, personal student names, private datasets, or confidential client records.

---

## 2. Mandatory Evidence Bundle Per Project

Every verified project in `evidence/<project-slug>/` (and mirrored to `frontend/public/evidence/<project-slug>/` for static web delivery) MUST contain four mandatory artifacts:

1. **`overview.png`** (Minimum resolution: `1280x800` px):
   - Full workbench view showing the IT EXPERTS Proof Room Execution Harness, project architecture summary, hardware environment (`NVIDIA RTX 5070 Ti` / `Python 3.12`), and primary visual output.
2. **`execution-result.png`** (Minimum resolution: `1280x800` px):
   - High-resolution visual proof of the algorithm, model inference, simulation grid, or query execution benchmark output produced by the real Python execution pipeline.
3. **`detailed-view.png`** (Minimum resolution: `1280x800` px):
   - Deep-dive telemetry view including execution logs, confusion matrices, packet tables, SQL query plans, mathematical equations, and verification checksums.
4. **`project-info.json`**:
   - Structured JSON manifest containing:
     - `project_id` & `slug`
     - `title_en` & `title_ar`
     - `category`
     - `verification_status` (`VERIFIED` | `UNVERIFIED`)
     - `executed_at` (ISO-8601 timestamp)
     - `hardware_environment`
     - `upstream_repository` & `license`
     - `metrics` (quantitative execution metrics such as latency, accuracy, F1-score, IoU, or throughput)
     - `sha256_checksums` for `overview.png`, `execution-result.png`, and `detailed-view.png`.

---

## 3. Automated Capture & Validation Pipeline

### Step 1: Real Workload Execution & Evidence Generation (`scripts/capture_screenshots.py`)
- Executes the actual Python scientific, computer vision, NLP, networking, database, and simulation workloads using local libraries (`torch`, `cv2`, `sklearn`, `scipy`, `networkx`, `sqlite3`, `matplotlib`).
- Renders high-DPI scientific figures and interactive HTML workbench views, capturing `overview.png`, `execution-result.png`, and `detailed-view.png` alongside cryptographic SHA-256 hashes in `project-info.json`.

### Step 2: Automated Integrity Audit (`scripts/validate_projects.py`)
- Verifies that all 12 project folders exist under `evidence/`.
- Checks that `overview.png`, `execution-result.png`, and `detailed-view.png` exist, are valid PNG image files with valid headers, have non-zero byte sizes (>15 KB), and meet minimum dimensional standards.
- Validates `project-info.json` against the required schema and confirms that the recorded SHA-256 checksums match the actual image files on disk.
- Exits with code `0` only if 100% of verified projects pass every check.
