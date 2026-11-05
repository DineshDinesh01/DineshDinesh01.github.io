/* Portfolio content, kept apart from presentation so it can be edited without touching the layout.
   Source of truth: markdown/02-portfolio/portfolio-content/** and markdown/12-public-authority/blogs/**.
   Rules: no client names, no client data, no internal system or model names, no invented metrics. */

window.CASES = [
  {
    id: 'bid', n: '01', yr: 2025, end: '2025-12', client: 'Global market-research company', related: ['survey', 'finetune', 'voice'], cats: ['agentic', 'rag', 'backend'], catLabel: 'Agentic AI', status: 'prod', statusLabel: 'Production',
    title: 'A 9-stage agentic pipeline to price market-research bids',
    short: 'For a global market-research company: from an unstructured bid email to a priced, explained estimate. Agents for judgement, code for maths, evals to catch drift.',
    hardq: 'How do you stop a pipeline of agents from drifting quietly, while every output still looks like valid JSON?',
    chips: ['AutoGen', 'ReAct + tools', 'pgvector', 'Rerankers', 'Celery'],
    fields: [
      ['Domain', 'Market research: bids for survey projects'],
      ['Type', 'Client delivery'],
      ['Period', 'Jun → Dec 2025'],
      ['My role', 'Senior Software Engineer. Designed the agent framework’s core layer; built the pipeline, retrieval, pricing tools and evaluation loop; owned the GPU and runtime work'],
      ['Status', 'In production']
    ],
    problem: 'The client receives bid requests by email all day: requests for information, quote requests, negotiations, award and rejection notices. For every quote request, the bid team had to read the thread and attachments, work out what was being asked (markets, audiences, number of completes, interview length, incidence rate), find similar past projects, choose panel vendors that could deliver, and calculate and explain a price, quickly and consistently.',
    approach: [
      ['Email intake', 'Event-triggered. Attachments converted to PDF, HTML bodies rendered, blank pages removed, everything merged into one readable document.'],
      ['Classification', 'One prompt per category (RFI, quote request, negotiation, confirmation, win, loss, other), loaded from a database and run in parallel.'],
      ['Extraction + validation', 'Bid fields pulled from email images; missing or inconsistent fields flagged for a human.'],
      ['Decomposition', 'A multi-market, multi-audience request split into market × audience × study-type sub-queries.'],
      ['Retrieval', 'Filters with tolerance ranges plus vector similarity over historical bids and vendor data, then a reranker.'],
      ['Vendor allocation', 'A blend of vendors chosen to cover the required completes.'],
      ['Pricing', 'A ReAct agent whose calculations run as code tools: weighted cost per interview, net and gross cost.'],
      ['Summary + confidence', 'An explained estimate, with confidence scored stage by stage.']
    ],
    fixes: [
      ['Agents doing arithmetic', 'Pricing moved to a ReAct agent with calculation tools. The agent decides, code calculates.'],
      ['Hard constraints ignored by prompts', '“Vendors must add up to the required completes” moved from a prompt rule into allocation code.'],
      ['Hard-to-debug agent hand-offs', 'Replaced free hand-offs with a fixed sequence and typed stage outputs.'],
      ['Retrieval quality', 'Combined filters and vector search, then moved from a general cross-encoder to a dedicated reranker model.'],
      ['Silent drift', 'Built an evaluation loop: the same bid run ten times and diffed field by field, a confusion matrix for classification against labelled emails, stage-level confidence, and human corrections stored as data from an editable summary table.'],
      ['Inconsistent field extraction', 'Prepared per-field fine-tuning data with a question-generation agent, and checked platform limits and cost before training.'],
      ['Runtime', 'Background processing on a task queue, chat-tool notifications, model work moved to dedicated workers to avoid GPU out-of-memory, and prompts versioned in a database.']
    ],
    tech: ['Python', 'FastAPI', 'AutoGen', 'LangChain (ReAct)', 'Azure OpenAI', 'PostgreSQL + pgvector', 'Cross-encoder + dedicated reranker', 'FAISS', 'Celery + Redis', 'Docker', 'Cloud event triggers', 'Playwright / LibreOffice'],
    impact: [
      'Moved bid estimation from manual research to an automated, explained estimate, delivered in production.',
      'Every estimate shows why it is confident or not, so the bid team knows where to check.',
      'My reporting manager credited my work as an important part of the successful implementation, especially handling unstructured multi-format emails, and the performance and GPU work.'
    ],
    learned: [
      'Use agents for judgement, and code for arithmetic and hard constraints.',
      'Evaluation has to be part of the system: repeat runs, labelled sets, stage confidence and human corrections.',
      'A confidence score is only useful when it explains why it is low.'
    ],
    posts: []
  },
  {
    id: 'largedocs', n: '02', yr: 2026, end: '2026-08', client: 'In-house product', related: ['tender', 'copilot', 'filings'], cats: ['architecture', 'document', 'rag'], catLabel: 'Architecture', status: 'design', statusLabel: 'My design · building',
    title: 'Large-document architecture: when the document has hundreds of pages',
    short: 'My designs for very large documents: a data foundation where every answer traces back to its page, and five layers where truth is created in exactly one place.',
    hardq: 'Why did a document pipeline stop at page 25, and why didn’t a bigger model fix it?',
    chips: ['Data modelling', 'Vision retrieval', 'Knowledge graph', 'Promoter–critic'],
    fields: [
      ['Domain', 'Very large documents: tenders, specifications, policy packs, regulatory and engineering documents'],
      ['Type', 'In-house product architecture (my designs)'],
      ['Period', 'Data foundation Jan → Apr 2026 · knowledge layers Mar → Aug 2026'],
      ['My role', 'Identified the architectural problem; designed the data architecture, data model and agent workflow; and authored the design documents. The knowledge-layer design was handed to a delivery team that is implementing it'],
      ['Status', 'Data foundation partly built · knowledge layers being implemented by another team']
    ],
    problem: 'The existing document platform processed PDFs as individual files. Very large documents exposed a limitation: only the first 25 pages were processed, so information after that was lost; the system had no idea of sections; tables that ran across pages became separate tables; answers had no evidence; documents couldn’t be linked to each other; every question needed OCR again; and onboarding a new document type needed heavy configuration. Most of these were problems with how data was stored and structured, not with the model.',
    approach: [
      ['Data foundation · hierarchy', 'File → document stack → project → use-case type, with role-based access at the project and use-case levels.'],
      ['Data foundation · decomposition first', 'Documents split into logical sections, first by heuristics, then refined by a model. Both versions are kept.'],
      ['Data foundation · immutable data model', 'Every stage writes an input audit, a result and an output audit; results are never overwritten. Immutable facts, explicit context, replayable intelligence, governed behaviour.'],
      ['Data foundation · lineage in every row', 'Run, batch, source file, tenant, time and previous-stage id on every table, so any value traces back to its page.'],
      ['Data foundation · pipeline', 'Vision embeddings and layout extraction in parallel → page filter → response-type extraction (single, list, paragraph, table) → post-processing → a graph node per answer → domain adaptation.'],
      ['Data foundation · known vs unknown questions', 'Defined fields go through the pipeline; open questions go through chat over the same traceable data. Agents last.'],
      ['Knowledge layers · five layers', 'Asset → document → knowledge → extraction → business. Each layer depends only on the one below.'],
      ['Knowledge layers · validation', 'Vision retrieval → candidate values → key inference → entities → evidence links → a promoter–critic validator that decides proceed, retry or escalate. Only validated knowledge reaches the graph.'],
      ['Knowledge layers · formatting', 'Formats validated knowledge as key-value, table or paragraph, and never re-interprets it.']
    ],
    fixes: [
      ['Data lost beyond page 25', 'The design processes every page in parallel, and each page belongs to exactly one sub-section.'],
      ['Answers with no evidence', 'Lineage columns and evidence links make traceability part of the schema.'],
      ['Tables across pages', 'Sub-section-level enrichment links the continuations.'],
      ['Trusting the model', 'Truth is created in one layer only, after validation; formatting can’t change values.'],
      ['Getting a team to adopt it', 'Wrote the design documents, data-model documentation and knowledge-graph write-ups, and ran design walkthroughs. I also wrote the agent-vs-RAG analysis and kept agents the lowest priority until the data foundation existed.']
    ],
    tech: ['Vision retrieval (ColQwen-style page embeddings)', 'Elasticsearch', 'Knowledge graph', 'PostgreSQL', 'Layout models', 'Vision-language OCR', 'LLM agents (validator / critic)', 'Python services'],
    impact: [
      'Reframed large-document accuracy as a data-foundation problem, and turned it into a concrete architecture and data model.',
      'The knowledge-layer design was adopted as the architecture another team now builds on.'
    ],
    learned: [
      'Get the data right first. A model can’t reason over a page that was never stored.',
      'Lineage and evidence belong in the schema, not in a later feature.',
      'Agents are safe only on traceable, replayable data.'
    ],
    posts: []
  },
  {
    id: 'copilot', n: '03', yr: 2026, end: '2026-10', client: 'Global manufacturing client', related: ['rfq', 'drawings', 'serving'], cats: ['agentic', 'document', 'serving'], catLabel: 'Engineering documents', status: 'ongoing', statusLabel: 'Pilot · ongoing',
    title: 'An engineering document copilot',
    short: 'For a global manufacturing client: compliance analysis of customer specifications against products, then a copilot that reads engineering diagrams, on models that run on-prem.',
    hardq: 'How do you turn “is this requirement compliant?” into an auditable answer with evidence, for every requirement in a long specification?',
    chips: ['LangGraph', 'vLLM', 'Vision + MoE models', 'Elasticsearch'],
    fields: [
      ['Domain', 'Electrical and industrial manufacturing: customer specifications, RFPs and engineering diagrams'],
      ['Type', 'Client delivery: POC won → production pilot'],
      ['Period', 'Feb 2026 → ongoing'],
      ['My role', 'Designed the custom solution and lead the technical effort; own stabilisation of the platform'],
      ['Status', 'Pilot · ongoing']
    ],
    problem: 'Customers send long specifications and RFPs. For each requirement, the client’s teams must decide whether their product is compliant, has a deviation, or needs an exception, and they must also read engineering diagrams. Doing this by hand across many document formats is slow and inconsistent.',
    approach: [
      ['POC', 'Compliance / deviation / exception analysis of customer requirements against the client’s product information, built as a quick MVP to prove value. It won the project.'],
      ['Agent graph (v2)', 'The linear script refactored into an autonomous LangGraph agent graph: requirement intake, query expansion, evidence search (documents and the web), compliance reasoning with an audit trail, checkpointing on Elasticsearch, packaged as a reusable library.'],
      ['Comparison + onboarding APIs', 'Project → sections → fields, with config-driven ingestion that switches between vision-based and functional extraction.'],
      ['On-prem, vision-native models', 'A vision-language model and a mixture-of-experts reasoning model served with vLLM on the client-approved GPU setup (quantisation, batching limits, speculative decoding), plus vision embeddings for retrieval.'],
      ['Copilot + diagram pilot', 'Diagram intake; extraction with layout, tiling, symbols and tile embeddings; a business layer and a knowledge layer for questions; ingestion → OCR/vision → layout → classification → extraction → validation and confidence → human review → integration.']
    ],
    fixes: [
      ['A slow, linear analysis script', 'Turned it into an agent graph with explicit nodes and checkpoints, so runs can resume and be audited.'],
      ['Data that can’t leave the client environment', 'On-prem model serving, with GPU memory and multimodal batching errors fixed.'],
      ['Many document formats', 'Config-driven ingestion instead of format-specific code.'],
      ['Platform stability', 'Fixed and deployed the end-to-end platform; I own bug-fixing and stabilisation.'],
      ['Security for enterprise rollout', 'Managed encryption keys and access-control integration.']
    ],
    tech: ['Python', 'FastAPI', 'LangGraph', 'Elasticsearch', 'PostgreSQL', 'vLLM', 'Vision-language + MoE models', 'Vision embeddings', 'Docker', 'Azure (identity, key management)', 'React frontend'],
    impact: [
      'The POC won the engagement and moved to a production pilot.',
      'Turned manual requirement-by-requirement analysis into an evidence-backed, auditable workflow.'
    ],
    learned: [
      'Turning a working script into an agent graph is mostly about making state, checkpoints and audit explicit.',
      'In enterprise settings, where the model runs and where the data stays matter as much as model quality.'
    ],
    posts: []
  },
  {
    id: 'health', n: '04', yr: 2025, end: '2025-07', client: 'US health insurer', related: ['pbm', 'timesheets', 'idp'], cats: ['document'], catLabel: 'Healthcare forms', status: 'delivered', statusLabel: 'Delivered',
    title: 'Prior-auth faxes for a US health insurer',
    short: 'Per-section vision extraction with domain rules, synthetic training data, and a touch-level view that shows exactly where humans still need to look.',
    hardq: 'When one fax has three IDs and three providers, how does the system pick the right one, every time?',
    chips: ['Qwen2-VL', 'vLLM', 'Synthetic data', 'Dashboards'],
    fields: [
      ['Domain', 'US healthcare: prior-authorization faxes, behavioral health, and grievance & appeals documents'],
      ['Type', 'Client delivery'],
      ['Period', 'Sep 2024 → Jul 2025'],
      ['My role', 'Software Engineer, then Senior Software Engineer, and single point of contact for the client: extraction design, prompts, synthetic data, evaluation, deployment support, status reporting'],
      ['Status', 'Delivered in phases inside the client’s environment']
    ],
    problem: 'Prior-authorization requests arrive as faxes and forms in many layouts, printed and handwritten. Intake staff must capture member, requesting / servicing / referring provider, facility, service, diagnosis and admission details accurately. The client wanted extraction first, without changing their systems, then extended it to behavioral-health and grievance & appeals documents.',
    approach: [
      ['Per-section vision extraction', 'Separate prompts for member, servicing provider, referring provider, facility, service and diagnosis, each returning values with bounding boxes. This replaced one large prompt.'],
      ['Domain rules', 'Which ID is the primary member ID (not secondary or government IDs), how to tell servicing from referring providers, and section-header priority. Name clean-up and ID format checks ran as pipeline scripts.'],
      ['Versioned prompt store', 'Prompts versioned per tenant and document type.'],
      ['Synthetic data', 'Printed and handwritten samples generated from the client’s field rules (members, providers, ICD-10 codes, requested services), plus control data for testing.'],
      ['Evaluation + dashboards', 'Per-field accuracy against control data, touch-level buckets (no, low, one, high touch) showing how much human correction each document needs, and actual-vs-extracted dashboards.'],
      ['Deployment', 'Inside the client’s isolated cloud environment (GPU VM, containers, managed database), with a simple upload-and-track UI.']
    ],
    fixes: [
      ['One prompt doing everything badly', 'Split into per-section prompts with clear inclusion and exclusion rules.'],
      ['Look-alike fields', 'Several IDs and several providers on one form: explicit domain rules plus post-processing validation.'],
      ['Not enough labelled data, and privacy limits', 'Synthetic printed and handwritten samples built from the client’s own rules.'],
      ['Proving progress', 'Field-level accuracy and touch-level reporting, weekly status updates, BRD/SOW updates and a project plan.']
    ],
    tech: ['Qwen2-VL', 'Llama 3.2 Vision', 'vLLM', 'Python', 'Java pipeline actions', 'PostgreSQL', 'Superset', 'Docker / Podman', 'Streamlit', 'Kafka'],
    impact: [
      'Delivered field-level extraction across multiple document types, with accuracy reporting the client could track.',
      'Gave intake teams a clear view of which documents need little or no correction.'
    ],
    learned: [
      'In healthcare forms, most errors come from look-alike fields, not unreadable text. Rules and per-section prompts matter more than a bigger model.',
      'Synthetic data, designed from the client’s own rules, unblocks testing when real data can’t be used freely.'
    ],
    posts: []
  },
  {
    id: 'platform', n: '05', yr: 2025, end: '2025-06', client: 'In-house product + 12 customer POCs', related: ['formx', 'templates', 'idp'], cats: ['document', 'architecture'], catLabel: 'Platform + POCs', status: 'prod', statusLabel: 'Product + 12 POCs',
    title: 'A document AI platform, and the POCs built on it',
    short: 'From a form-extraction intern project to agentic document intelligence, plus twelve customer POCs: engineering drawings, disaster-response timesheets, regulatory filings, invoices, voice agents and more.',
    hardq: 'No public dataset had checkboxes. How do you train a detector that works on real, noisy scans?',
    chips: ['Detectron2', 'YOLO', 'DETR', 'Triton', 'vLLM'],
    fields: [
      ['Domain', 'Intelligent document processing across healthcare, finance, insurance, engineering and more'],
      ['Type', 'In-house product (several releases) + customer POCs'],
      ['Period', '2022 → 2025'],
      ['My role', 'Grew from front-end intern to AI engineer: UI, Python services, model training, LLM integration, customer POCs and demos'],
      ['Status', 'Product in production · POCs delivered to multiple customers']
    ],
    problem: 'Customers send forms, invoices, IDs, timesheets, filings and drawings, and each brings its own hard element: tables, checkboxes, handwriting, layout. The platform had to grow one hard element at a time, and every POC had to show a customer their own documents working end to end, quickly.',
    approach: [
      ['Form extraction · 2022', 'Per-field models for forms. I started on the UI (Vaadin), then moved to model work.'],
      ['Template extraction · 2022–23', 'Key-value pairs, DETR tables, VGG16 checkboxes and object detection.'],
      ['General-purpose IDP · 2023', 'Handwriting, faces and QR codes, with a FastAPI backend.'],
      ['Agentic document intelligence · 2024–25', 'Layout analysis, my custom-trained checkbox detector, signature and handwriting extraction, concurrent key-value / table / checkbox processing, LLM and vision-language extraction served with Triton and vLLM, an agentic page filter, and partner integrations (webhooks and low-code platforms).']
    ],
    fixes: [
      ['Checkboxes, with no public dataset', 'Image processing and off-the-shelf detectors failed on real scans. Tried Open Images (no checkbox class), OpenCV contours, pytesseract and YOLOv5 / YOLOv8x before settling on a Detectron2 Faster R-CNN trained on my own dataset, with a separate checkbox-state model served behind the platform’s API.'],
      ['Annotation bugs', 'Wrote CSV → COCO and YOLO conversions; fixed non-normalised and out-of-bounds coordinates, category-ID mapping, duplicate annotation IDs and image-size mismatches.'],
      ['Handwritten timesheets with no training data', 'Generated synthetic handwritten samples from HTML replicas of the form.'],
      ['Running headers read as section titles', 'Layout-aware prompts (font size, position, style) that ignore running headers and document codes.']
    ],
    tech: ['Python', 'FastAPI', 'Django', 'Java / Spring Boot', 'Detectron2', 'YOLO', 'DETR', 'VGG16', 'doctr / PaddleOCR / Tesseract', 'LayoutParser', 'Mistral', 'Qwen-VL', 'Triton', 'ONNX', 'vLLM', 'Elasticsearch', 'Streamlit', 'Docker', 'Jenkins'],
    impact: [
      'Product in production across several releases; POCs delivered to customers across healthcare, finance, engineering and more.',
      'A live showcase of ten use cases for an industry event: printed and handwritten key-values, faces, checkboxes, tables, figures, currency, bulletins, paragraphs and chat with documents.'
    ],
    learned: [
      'A platform grows by solving one hard element at a time: tables, checkboxes, handwriting, then whole documents.',
      'POCs succeed when they show the customer their own documents working end to end, quickly.'
    ],
    pocs: [
      ['Engineering drawings', 'Indian engineering conglomerate', 'Vision-model analysis of mechanical and CAD drawings: compare two drawings and find differences; read truss, turbine, flange and cable diagrams.', '⌗', 'drawings'],
      ['Handwritten timesheets', 'US disaster-response staffing firm', 'Static-schema table extraction (names, signatures, phone, odometer readings), trained on synthetic handwritten samples generated from HTML replicas of the form.', '✎', 'timesheets'],
      ['Regulatory filings', 'US biotech company', 'Page title, section and page-number extraction with layout-aware prompts, an agent workflow, and search over Elasticsearch.', '§', 'filings'],
      ['Forms + timesheets', 'US company', 'Table plus checkbox detection and extraction; large-model testing on GPU.', '☑'],
      ['Quotations + invoices', 'A fashion retailer’s vendors, via a SaaS workflow partner', 'Payment-terms extraction with an open LLM, multi-header tables, currency detection, and a webhook into the partner platform.', '¤', 'invoices'],
      ['Invoices', 'UK finance company, via the same partner', 'Header fields with purchase-order lookup, pushed to the partner platform by webhook.', '⎙', 'invoices'],
      ['Document AI', 'Working-capital fintech', 'Document extraction POC.', '◫'],
      ['Voice activation', 'Task-management tools', 'Speech → structured command → API action, with a confirm-before-run UI.', '◖', 'voice'],
      ['Voice + knowledge', 'Postal-software company', 'Voice-driven parcel and location API calls.', '✉', 'voice'],
      ['Survey programming', 'Healthcare survey research', 'Survey PDF → extraction agent → knowledge graph → generated survey forms.', '⋔', 'survey'],
      ['Edge deployment', 'Kiosk / edge devices, several customers', 'Document AI POCs on edge devices.', '▣'],
      ['Live showcase', 'Industry event', 'A demo page of 10 live use cases, from handwritten key-values to chat with documents.', '✦', 'showcase']
    ],
    posts: []
  }
  ,
  {
    id: 'pbm', n: '06', yr: 2025, end: '2025-06', client: 'US pharmacy-benefit prior-auth platform', related: ['health', 'serving', 'idp'], cats: ['document', 'serving'], catLabel: 'Model serving', status: 'delivered', statusLabel: 'Delivered in phases',
    title: 'Production readiness for a prior-auth platform',
    short: 'For a US pharmacy-benefit prior-authorization platform: extraction services in 2023, then the 2025 push to production: serving chosen by measurement, confidence from log-probabilities, a fixed accuracy regression, GPU cost and monitoring.',
    hardq: 'Does the serving engine change accuracy, or only speed? And what should a confidence score be based on?',
    chips: ['vLLM', 'AWQ', 'Triton', 'Grafana', 'Detectron2'],
    fields: [
      ['Domain', 'US pharmacy-benefit prior authorization: faxes carrying member, prescriber, provider, drug and NPI details'],
      ['Type', 'Client delivery, in three phases'],
      ['Period', 'May 2023 → Jun 2025'],
      ['My role', 'Built the 2023 extraction services and their serving. In 2025, much of the production-readiness engineering: serving, prompt rules, accuracy, confidence, GPU cost and monitoring, with status updates to the client team'],
      ['Status', 'Delivered in phases']
    ],
    problem: 'Prior-authorization requests for medications arrive as faxes in many payer templates, printed and handwritten. The platform needed member, prescriber, provider, drug and NPI details read automatically into its system: accurate enough for production, at a GPU cost that made sense, and monitored once live.',
    approach: [
      ['Extraction services · 2023', 'Layout detection, my checkbox detector plus a state model, DETR tables, OCR for handwriting, a YOLO signature detector, face cropping and a zero-shot page filter. Served with FastAPI (thread pools for multi-page documents, models preloaded, CPU/GPU fallbacks) and called from the Java platform.'],
      ['Fax pipeline · 2024', 'A Java pipeline test harness with callbacks, and a key-value vision-language model consumer that calls Triton.'],
      ['End-to-end tests · 2025', '50-file runs, batch and per-PDF timing, and a total-cost-of-ownership sheet.'],
      ['Serving', 'A quantized (AWQ) vision-language model on a cloud A100 and on serverless GPUs. I managed the serverless GPU budget.'],
      ['Prompt rules', 'Prescriber vs provider, synonym lists, per-template quirks, member-header priority (Member > Patient > Enrollee > Subscriber), drug strength vs quantity, NPI and ZIP fixes.'],
      ['Engine by measurement', 'vLLM and transformers compared on the same 20 files. vLLM was more accurate, so serving moved to vLLM.'],
      ['Confidence + monitoring', 'Field confidence from token log-probabilities, an agentic page filter, an urgency-triage improvement, load tests, and Grafana + Prometheus.']
    ],
    fixes: [
      ['No checkbox dataset existed', 'Built one from full-size scans, wrote the annotation converters, and trained a Faster R-CNN detector plus a checkbox-state model.'],
      ['Environment breakage', 'Pinned torch / Detectron2 / CUDA versions, preloaded models and added CPU/GPU fallbacks.'],
      ['Prescriber vs provider, header synonyms', 'Explicit rules and priority lists in the prompts.'],
      ['Confidence that means something', 'Per-field confidence from token log-probabilities instead of a self-reported score.'],
      ['Choosing the serving engine', 'Measured accuracy on the same files instead of assuming the engine only changes speed.'],
      ['A 7–10% accuracy regression', 'Found and fixed.'],
      ['Cost', 'Per-PDF timing, a cost sheet and a managed serverless GPU budget.']
    ],
    tech: ['Python', 'FastAPI', 'LayoutParser', 'Detectron2', 'DETR', 'YOLO', 'doctr / EasyOCR / PaddleOCR', 'Java / Spring Boot platform', 'Triton', 'vLLM', 'AWQ quantization', 'Cloud A100', 'Serverless GPUs', 'Grafana', 'Prometheus'],
    impact: [
      'Took extraction from model demos to a measured, monitored setup, with serving decisions backed by test runs.',
      'Recovered a 7–10% accuracy drop.'
    ],
    learned: [
      'Measure serving choices on the same files. The engine can change accuracy, not only speed.',
      'A confidence score needs a source. Log-probabilities gave one.',
      'Production readiness is mostly tests, timing, cost and monitoring.'
    ],
    posts: []
  },
  {
    id: 'tender', n: '07', yr: 2026, end: '2026-02', client: 'Large power-infrastructure group', related: ['largedocs', 'rfq', 'filings'], cats: ['rag', 'document'], catLabel: 'Retrieval at scale', status: 'stopped', statusLabel: 'Pilot · stopped by client (cost)',
    title: 'Tender intelligence for 800-page RFPs',
    short: 'For a large power-infrastructure group: an 800+ page RFP with amendments, searchable with evidence, with element-level diffs between versions and risk checks against the specifications.',
    hardq: 'On an 800-page tender, how do you get the page that answers the question, not just the pages that mention it?',
    chips: ['Hybrid BM25 + vector', 'Reranker', 'Elasticsearch', 'VLM OCR'],
    fields: [
      ['Domain', 'Power-transmission and infrastructure tenders: RFPs of 800+ pages, plus amendments'],
      ['Type', 'Client pilot'],
      ['Period', 'Nov 2025 → Feb 2026'],
      ['My role', 'Built the ingestion, search, document-diff and risk-analysis APIs with the team. Leadership asked me to lead the technical discussions with the client'],
      ['Status', 'Reached the pilot phase, then stopped by the client because of cost']
    ],
    problem: 'A large power-infrastructure group’s tender came as an RFP of 800+ pages, followed by amendments. The team needed to find specifications quickly, see what changed between versions, and flag risks against the specifications, with every answer pointing to the page it came from.',
    approach: [
      ['Ingestion', 'A paper itemiser, a small layout model, vision-language OCR (two models, a third tried), and page and element data indexed in Elasticsearch.'],
      ['Search', 'Hybrid BM25 + vector search over page OCR, each question decomposed into 3–5 sub-queries, then a dedicated reranker model.'],
      ['Answers with evidence', 'Every answer carries its page and element id.'],
      ['Document-diff API', 'Two document ids in; element-level changes and a business-impact summary out.'],
      ['Risk-analysis API', 'Document → page OCR → cross-check against specifications → risks, with screens for risks, specs and key notes.'],
      ['Spec discovery + accuracy spec', 'Tender-field prompts with domain anchors, discovery of specs nobody listed in advance, and a written “guarded RAG” accuracy spec for 800-page PDFs.']
    ],
    fixes: [
      ['Rerank precision on very large PDFs', 'A dedicated reranker after hybrid retrieval.'],
      ['Empty or poor results from some hybrid queries', 'Query decomposition into 3–5 sub-queries.'],
      ['Trust', 'Page and element evidence on every answer, so reviewers can check the source.'],
      ['Version changes', 'An element-level diff instead of comparing whole documents.']
    ],
    tech: ['SmolDocling (layout)', 'Qwen-VL + DeepSeek-OCR', 'Elasticsearch + Kibana', 'BM25 + vector hybrid search', 'Qwen3 embeddings', 'Qwen3-Reranker', 'FastAPI', 'Python'],
    impact: [
      'Reached the pilot phase. Leadership credited the team for it and made me the point person for technical discussions.',
      'The client later stopped the project because of cost.'
    ],
    learned: [
      'On very large documents, hybrid search, query decomposition and reranking work together. None of them is enough alone.',
      'Retrieval models and answering models do different jobs.',
      'Page and element evidence is what lets a reviewer trust an answer on an 800-page document.'
    ],
    posts: []
  },
  {
    id: 'nbfc', n: '08', yr: 2023, end: '2023-12', client: 'NBFC client', related: ['invoices', 'idp', 'serving'], cats: ['backend'], catLabel: 'Fintech backend', status: 'prod', statusLabel: 'Production',
    title: 'A co-lending platform for an NBFC',
    short: 'Loan-pool filters on Spark, 1 GB+ chunked uploads with checksums, column-level encryption, permission checks on every API, and a cash-flow engine.',
    hardq: 'How do you upload, protect and filter loan pools at sizes where normal uploads simply fail?',
    chips: ['Flask', 'PySpark', 'Dask', 'RSA / AES', 'pytest'],
    fields: [
      ['Domain', 'Lending: co-lending loan pools between an NBFC and its originators'],
      ['Type', 'Client delivery'],
      ['Period', 'Jul → Dec 2023'],
      ['My role', 'Backend developer (Python), deployed on the client’s team'],
      ['Status', 'In production']
    ],
    problem: 'In co-lending, loan pools from originators are filtered against the lender’s rules, cash-flowed, and backed by documents. The platform needed services that could filter large loan pools by business rules and show their impact, compute cash flows correctly (including holidays and moratoriums), handle very large file uploads safely with sensitive columns protected, and enforce permissions on every API.',
    approach: [
      ['Filter module', 'Loan-pool filters (minimum holding period, principal outstanding, loan cycle, age, and custom uploaded rules) on PySpark DataFrames, with group vs one-by-one impact summarised for the pool and pivot filters for analysis.'],
      ['Document management', 'Files of 1 GB+ split into dynamically sized chunks in parallel, each with a SHA-256 checksum, and re-joined with integrity checks. Versioned documents, zip download and parallel chunk download on top.'],
      ['Column-level encryption', 'Sensitive columns in uploaded CSV, Excel and Parquet files encrypted (RSA-OAEP / AES with managed key files), with Dask for very large files.'],
      ['Permission middleware', 'Every API call validated against permission data; unauthorised calls get 401.'],
      ['Cash-flow engine', 'Investor fixed-EMI interest, moratorium handling and next-working-day logic for holidays and week-offs, plus NPA processing.']
    ],
    fixes: [
      ['Slow filters on big pools', 'Moved to PySpark, with filter groups executed in parallel.'],
      ['Uploads failing on huge files', 'Parallel chunking with checksums, a chunk-metadata data model and a verified re-join.'],
      ['Protecting sensitive data in files', 'Column-level encryption selectable by column, with decryption on re-joined files.'],
      ['Quality', 'pytest with mocking across six modules (80%+ coverage on the modules I owned), Swagger documentation, packaged builds and a Jenkins pipeline.']
    ],
    tech: ['Python', 'Flask', 'PySpark', 'Dask', 'Parquet', 'Celery + Redis', 'SQLAlchemy / PostgreSQL', 'cryptography (RSA / AES)', 'pytest', 'Swagger', 'Jenkins'],
    impact: [
      'Delivered production modules for loan-pool filtering, document management, encryption, permissions and cash flows.',
      'Unit-test coverage above 80% on the modules I owned.'
    ],
    learned: [
      'In finance systems, correctness rules (holidays, moratoriums, rounding) matter as much as speed.',
      'Large-file handling needs integrity checks at every step, not only at the end.'
    ],
    posts: []
  }
];

// When a post goes live, add its link, e.g.  url: 'https://medium.com/@you/…'
// The card and the post view then say "Published" and link to it.
window.ARTICLES = [];

/* Pilot lab: each stage names the project where it was learned. */
window.LAB = {
  intake: { n: '01', chip: 'INPUT CONTRACT', title: 'Start with what actually arrives.',
    desc: 'Bid requests came as email threads with attachments, HTML bodies and blank pages. Prior-auth requests came as printed and handwritten faxes in many layouts. Before any model runs, I normalise the input into one readable document, classify what it is, and record where it came from, so every later value can point back to its source.',
    tokens: ['email · fax · PDF', 'convert + merge + classify', 'one document + source record'], hot: 1,
    points: [['Decision', 'One normalised document per request, with its source recorded.'], ['Failure mode', 'Lost attachments, blank pages, the wrong document type.']], refs: ['bid', 'health'] },
  structure: { n: '02', chip: 'STRUCTURE BEFORE INTELLIGENCE', title: 'Get the data foundation right first.',
    desc: 'A document platform processed only the first 25 pages of each PDF, with no idea of sections, and tables split across pages. A bigger model could not fix that. My data-foundation design splits documents into logical sections, keeps every page, writes an input audit, a result and an output audit at each stage, and puts lineage on every row.',
    tokens: ['every page', 'sections + sub-sections', 'lineage on every row'], hot: 1,
    points: [['Decision', 'Immutable facts, explicit context, replayable intelligence.'], ['Failure mode', 'Pages after 25 never stored; one table saved as four.']], refs: ['largedocs'] },
  understand: { n: '03', chip: 'RIGHT TOOL, RIGHT JOB', title: 'Route each task to the right capability.',
    desc: 'Retrieval is filters plus vectors plus a reranker, or page-image retrieval when layout carries the meaning. Agents decide what to do; anything with one right answer (arithmetic, vendor totals, lookups) runs as code. Known fields go through the pipeline, open questions through chat over the same traceable data.',
    tokens: ['hybrid / vision retrieval', 'agent decides', 'code calculates'], hot: 2,
    points: [['Decision', 'Agents for judgement, code for certainty.'], ['Failure mode', 'An agent that is “mostly right” about a price.']], refs: ['bid', 'copilot'] },
  validate: { n: '04', chip: 'UNCERTAINTY IS A DESIGN INPUT', title: 'Check, route, recover.',
    desc: 'In my knowledge-layer design, a promoter proposes a value and a critic decides: proceed, retry, or escalate to a human. In the bid pipeline, the same bid ran ten times and was diffed field by field, classification had a confusion matrix, and every human correction was stored as data. For the health insurer, touch levels showed exactly where people still had to look.',
    tokens: ['candidate value', 'promoter + critic', 'proceed / retry / human'], hot: 1,
    points: [['Decision', 'Truth is created in one layer, only after validation.'], ['Failure mode', 'Silent drift behind valid-looking JSON.']], refs: ['largedocs', 'bid', 'health'] },
  deliver: { n: '05', chip: 'MAKE IT USABLE', title: 'Ship a capability, not a demo.',
    desc: 'The output has to be something another system or person can depend on: a stable schema, evidence links, an API or webhook, background workers so the GPU never runs out of memory, prompts versioned in a database, and models served where the client’s data is allowed to live.',
    tokens: ['validated record', 'API · webhook · queue', 'downstream workflow'], hot: 2,
    points: [['Decision', 'Typed outputs, versioned prompts, on-prem when required.'], ['Failure mode', 'GPU out-of-memory, duplicate actions, opaque errors.']], refs: ['bid', 'platform', 'copilot'] }
};

/* Toolkit: where each tool was used (case ids, post ids, or a short note). */
window.TOOLS = [
  { layer: 'Agents & orchestration', items: [
    ['LangGraph', ['copilot']], ['AutoGen', ['bid']], ['LangChain (ReAct)', ['bid', 'finetune']], ['LlamaIndex AgentWorkflow', ['filings']], ['LLM-as-judge', ['rfq']],
    ['Celery + Redis', ['bid', 'nbfc']], ['Versioned prompt store', ['bid', 'health']] ] },
  { layer: 'Retrieval & knowledge', items: [
    ['Elasticsearch', ['tender', 'largedocs', 'copilot', 'filings']], ['pgvector', ['bid']], ['FAISS', ['bid']], ['Rerankers', ['bid', 'tender']],
    ['Vision retrieval (ColQwen-style)', ['largedocs', 'rfq']], ['RAGAS evaluation', ['rfq']], ['Haystack', ['filings']], ['Knowledge graph', ['largedocs', 'survey']], ['Neo4j + Cypher', ['survey']], ['Qdrant', ['note:RAG starter service']] ] },
  { layer: 'Document AI & vision', items: [
    ['Layout models', ['tender', 'largedocs', 'pbm', 'filings']], ['Docling', ['tender', 'survey']], ['Detectron2', ['pbm', 'platform']], ['YOLO', ['invoices', 'pbm']],
    ['DETR', ['templates', 'pbm']], ['Attend-Copy-Parse (ACP)', ['formx']], ['VGG16', ['templates', 'idp']], ['Donut', ['idp']], ['doctr · PaddleOCR · Tesseract', ['invoices', 'pbm', 'idp']], ['Qwen-VL family', ['health', 'tender']], ['Llama 3.2 Vision', ['health']], ['Whisper (speech)', ['voice']] ] },
  { layer: 'Models & serving', items: [
    ['vLLM', ['copilot', 'health', 'pbm', 'serving']], ['Triton', ['serving', 'pbm']], ['ONNX', ['serving']], ['Quantisation (AWQ)', ['copilot', 'pbm', 'serving']], ['Speculative decoding', ['copilot']], ['DeepSpeed', ['serving']],
    ['LoRA / QLoRA · Unsloth', ['finetune']], ['Azure OpenAI', ['bid', 'finetune']], ['Serverless GPU + autoscaling', ['serving', 'pbm']], ['Kubernetes + Terraform (on-prem GPU)', ['serving']] ] },
  { layer: 'Backend, data & infra', items: [
    ['Python', ['bid', 'largedocs', 'nbfc', 'copilot', 'health', 'pbm', 'tender', 'platform']], ['FastAPI', ['bid', 'copilot', 'tender', 'pbm', 'survey', 'idp']], ['Flask', ['nbfc']], ['Django', ['templates']], ['Java / Spring Boot', ['pbm', 'formx']],
    ['PostgreSQL', ['bid', 'largedocs', 'nbfc', 'copilot', 'health', 'voice']], ['PySpark', ['nbfc']], ['Dask', ['nbfc']], ['Kafka', ['health']], ['Redis', ['bid', 'voice']], ['Docker', ['bid', 'copilot', 'health', 'serving']],
    ['Jenkins', ['nbfc', 'invoices']], ['Azure', ['copilot', 'bid']], ['pytest', ['nbfc']], ['Superset', ['health']], ['Streamlit', ['health', 'timesheets', 'voice']], ['Grafana + Prometheus', ['pbm']], ['Webhooks', ['invoices']] ] }
];

window.ASK_SUGGEST = [
  'How do you stop agents from drifting?',
  'How do you handle documents with hundreds of pages?',
  'Have you served models on-prem?',
  'How did you extract fields from insurance faxes?',
  'Have you built a knowledge graph?',
  'What models have you trained yourself?'
];

/* More projects: each gets its own page, like the case files above, with a generated animated flow
   (assets/scenes.js → flowScene). Same rules: anonymized clients, synthetic data, no internal names,
   no client volumes or accuracy numbers, nothing invented. Evidence: chat_sessoion/reports/portfolio-claims-ledger.md */
window.MORE = [
  {
    id: 'rfq', n: '09', yr: 2026, end: '2026-09', client: 'Engineering and EPC sourcing client',
    cats: ['agentic', 'rag'], catLabel: 'Agentic RAG', status: 'proof', statusLabel: 'POC + design',
    title: 'RFQ to proposal: an agent that ranks the evidence',
    short: 'For an engineering and EPC sourcing client: split every customer requirement into checkable parts, rank the evidence for each, and let a judge model give a verdict you can trace. Then draft the proposal from the closest past ones.',
    hardq: 'When one requirement has four conditions, how do you show which one failed, instead of a single yes or no?',
    chips: ['Agentic RAG', 'LLM judge', 'Vision RAG', 'RAGAS'],
    fields: [
      ['Domain', 'Industrial sourcing: customer RFQs, questionnaires, past proposals, bills of quantities'],
      ['Type', 'Client POC + solution design'],
      ['Period', 'Aug → Sep 2026'],
      ['My role', 'Designed the evidence-ranking approach and the retrieval evaluation; wrote the high-level design and change request'],
      ['Status', 'POC built · high-level design written']
    ],
    problem: 'Customer RFQs arrive as long documents with drawings and spreadsheets. For each one, the sourcing team fills a questionnaire, builds a structured RFQ, a bill of quantities, a work breakdown and a budget, and then writes a proposal, usually by hunting through similar past RFQs and proposals. The client wanted requirements pulled out and checked against evidence, and new proposals drafted from the closest past ones, with a person reviewing both.',
    approach: [
      ['Two flows', 'RFQ → extracted requirements → questionnaire filled by the system → human review → structured RFQ → BOQ, work-breakdown and budget sheets → the ERP. And: new RFQ → similar past RFQs and proposals → draft proposal from templates (drawing, document, spreadsheet) → human review.'],
      ['Decompose each requirement', 'One requirement becomes sub-requirements R1…Rn, each small enough to check on its own.'],
      ['Rank the evidence', 'Candidate passages are retrieved and ranked for every sub-requirement before anything is judged.'],
      ['Judge with a trace', 'An LLM judge gives a verdict per sub-requirement and then overall, and the reviewer sees the sub-verdict trace.'],
      ['Retrieval by measurement', 'A 50-question evaluation set compares text-file RAG with ColBERT-style vision RAG, scored with RAGAS.'],
      ['Design for the next phase', 'A high-level design and change request covering both flows and their review steps.']
    ],
    fixes: [
      ['One yes/no per requirement hides the reason', 'Sub-requirements with their own verdicts, so a reviewer sees exactly which condition isn’t met.'],
      ['Judging on weak retrieval', 'Evidence is ranked first; the judge only sees ranked evidence.'],
      ['Text or vision retrieval, decided by opinion', 'A fixed 50-question set with RAGAS metrics decides.'],
      ['Every proposal written from scratch', 'Start from the closest past proposals and templates, then a person reviews.']
    ],
    tech: ['Python', 'Agentic RAG', 'LLM-as-judge', 'Text RAG', 'ColBERT-style vision RAG', 'RAGAS'],
    impact: [
      'Requirement checks became verdicts a reviewer can audit, one condition at a time.',
      'The choice between text and vision retrieval rests on a fixed question set, not on a demo.'
    ],
    learned: [
      'Break a requirement down before you judge it. Verdicts on small, checkable parts are easier to trust and to fix.',
      'Settle retrieval debates with a fixed question set.'
    ],
    posts: [], related: ['copilot', 'tender', 'rfpflow'],
    flow: { title: 'rfq → proposal', steps: [
      { t: 'RFQ in', c: 'A customer RFQ arrives with drawings and spreadsheets. Every page is read and indexed.', o: 'RFQ · 3 files' },
      { t: 'Requirements', c: 'Requirements are pulled out and mapped to the questionnaire the team must fill.', o: 'R-12 found' },
      { t: 'Decompose', c: 'Each requirement is split into sub-requirements that can be checked one by one.', o: 'R-12 → R1…R4' },
      { t: 'Rank evidence', c: 'Candidate passages are retrieved and ranked for every sub-requirement.', o: 'top 3 per Rn' },
      { t: 'Judge', c: 'A judge model gives a verdict for each sub-requirement, then overall, with the trace visible.', o: '3 met · 1 gap', warn: true },
      { t: 'Review', c: 'A reviewer reads the trace, fixes what is wrong and approves.', o: 'approved', human: true },
      { t: 'Proposal draft', c: 'The closest past proposals and templates seed the draft proposal and its sheets.', o: 'draft + BOQ' }
    ] }
  },
  {
    id: 'rfpflow', n: '10', yr: 2026, end: '2026-04', client: 'In-house product',
    cats: ['architecture'], catLabel: 'Product design', status: 'design', statusLabel: 'Design',
    title: 'An RFP workflow: approvals, versions and evidence-backed drafts',
    short: 'The high-level design for an RFP and RFQ workflow product: multi-stage approvals with role-based access and version control, an RFQ architecture, and an AI response system that maps customer specs to requirements and drafts answers with evidence.',
    hardq: 'Who approved which version of which answer, and on what evidence?',
    chips: ['High-level design', 'RBAC', 'Versioning', 'RAG'],
    fields: [
      ['Domain', 'RFP and RFQ processes in sourcing and engineering'],
      ['Type', 'In-house product design'],
      ['Period', 'Jan → Apr 2026'],
      ['My role', 'Researched the RFP and RFQ process; wrote the high-level design, the RFQ architecture and a DevOps reference'],
      ['Status', 'Design']
    ],
    problem: 'Answering an RFP means many documents, many reviewers and many versions. Teams lose track of which answer was approved, by whom and on what basis. The product needed a workflow for that, plus AI that drafts answers from evidence instead of from memory.',
    approach: [
      ['Process research', 'How RFPs and RFQs actually move through sourcing and engineering teams, using public RFP datasets as material.'],
      ['Multi-stage approval', 'Document approvals in stages, with role-based access and version control on every document.'],
      ['RFQ architecture', 'Intake, requirement mapping, response drafting and review as separate parts with clear hand-offs.'],
      ['AI response system', 'Customer spec → requirement mapping → a response draft with compliance status and evidence for each answer.'],
      ['Delivery', 'A DevOps reference for building and deploying it.']
    ],
    fixes: [
      ['Approvals tracked in email', 'Approval stages and roles as part of the data model.'],
      ['Answers with no source', 'Every drafted answer carries its compliance status and evidence.']
    ],
    tech: ['High-level design', 'Role-based access control', 'Document versioning', 'RAG', 'DevOps reference'],
    impact: ['A written design for approvals, versions and evidence-backed drafting that the team could review and estimate.'],
    learned: ['In document workflows, approvals and versions belong in the data model, not in a later feature.'],
    posts: [], related: ['rfq', 'tender', 'copilot'],
    flow: { title: 'rfp workflow', steps: [
      { t: 'RFP in', c: 'The customer RFP and its clarification documents come in as one project.', o: 'RFP · v1' },
      { t: 'Map', c: 'Customer specs are mapped to requirements.', o: '42 requirements' },
      { t: 'Draft', c: 'Each answer is drafted with a compliance status and its evidence.', o: 'draft v1' },
      { t: 'Approve', c: 'Approvals happen in stages, by role. Every version is kept.', o: 'v2 approved', human: true },
      { t: 'Submit', c: 'The approved version goes out, with its full history.', o: 'submitted ✓' }
    ] }
  },
  {
    id: 'survey', n: '11', yr: 2025, end: '2025-10', client: 'Survey platform of a global market-research company',
    cats: ['agentic', 'document'], catLabel: 'Knowledge graph', status: 'delivered', statusLabel: 'Built',
    title: 'A survey questionnaire, turned into a knowledge graph',
    short: 'Survey documents in, structured questions out: a vision agent reads every question, a person checks the doubtful ones, and a graph maps answer codes, routing and termination rules so survey forms can be generated.',
    hardq: '“If they answer 3 here, end the survey.” How do you make rules like that machine-readable without losing one?',
    chips: ['Docling', 'Vision agent', 'Neo4j', 'Human review'],
    fields: [
      ['Domain', 'Healthcare survey research: questionnaires with answer codes, routing and termination rules'],
      ['Type', 'Client build for their survey platform'],
      ['Period', 'Sep → Oct 2025'],
      ['My role', 'Built the ingestion, the extraction and validation agents, the graph build and the APIs'],
      ['Status', 'Built']
    ],
    problem: 'Survey programmers turn questionnaire documents into working survey forms by hand. A healthcare questionnaire has many questions, each with answer codes, routing and termination rules (“if the respondent is not a practising physician, end the survey”). Miss one rule and the survey breaks. The team wanted the questionnaire read into a structure that forms could be generated from.',
    approach: [
      ['Ingestion', 'Questionnaires parsed with a layout-aware document converter and stored as chunks with their position.'],
      ['Vision extraction agent', 'A vision-language model reads each question into JSON: question text, responses, codes and terminate rules.'],
      ['Human validation', 'An input-validation agent sends doubtful items to a person; chunk summaries carry confidence scores.'],
      ['Knowledge graph', 'An LLM graph transformer turns validated questions into Cypher, building a survey graph in Neo4j, termination mapping included.'],
      ['APIs + UI', 'FastAPI endpoints for extraction, summaries and node building, and a React screen to review them.']
    ],
    fixes: [
      ['Rules hidden in prose', 'Terminate and routing rules extracted as explicit fields, then stored as edges in the graph.'],
      ['Silent extraction errors', 'A confidence score on every chunk summary, and a validation step before anything reaches the graph.'],
      ['Questions as flat text', 'A graph of questions, answers and rules that forms can be generated from.']
    ],
    tech: ['Python', 'Docling / SmolDocling', 'Vision-language model (GPT-4.1-mini)', 'LLM graph transformer', 'Neo4j + Cypher', 'FastAPI', 'React'],
    impact: [
      'Questionnaire documents became a structured survey graph that people can review.',
      'Termination and routing rules became data instead of notes in a document.'
    ],
    learned: [
      'When rules matter, model them as relationships. The graph made routing visible and checkable.',
      'Put the human checkpoint before the graph, not after it.'
    ],
    posts: [], related: ['bid', 'platform'],
    flow: { title: 'questionnaire → graph', steps: [
      { t: 'Questionnaire', c: 'A survey questionnaire arrives as a document: questions, answer codes, routing notes.', o: 'survey.docx' },
      { t: 'Parse', c: 'A layout-aware converter splits it into chunks and keeps their positions.', o: 'chunks + layout' },
      { t: 'Read questions', c: 'A vision agent turns each question into JSON: text, responses, codes, terminate rules.', o: 'Q12 · 5 codes' },
      { t: 'Validate', c: 'Doubtful items go to a person. Every summary carries a confidence score.', o: '2 flagged', human: true },
      { t: 'Build graph', c: 'Validated questions become Cypher. The graph links questions, answers and rules.', o: 'Q12 → END' },
      { t: 'Generate', c: 'Survey forms are generated from the graph through APIs.', o: 'form ready ✓' }
    ] }
  },
  {
    id: 'filings', n: '12', yr: 2025, end: '2025-05', client: 'US biotech company',
    cats: ['document', 'rag'], catLabel: 'Regulatory documents', status: 'proof', statusLabel: 'POC · demo',
    title: 'Finding the right section in a regulatory filing',
    short: 'For a US biotech company: titles, sections and page numbers pulled out of long regulatory submissions with an agent workflow and layout-aware prompts, then searchable with a retrieval pipeline over Elasticsearch.',
    hardq: 'Every page repeats the same header. How do you stop the model from reading it as a section title?',
    chips: ['Agent workflow', 'Pydantic', 'Haystack', 'Elasticsearch'],
    fields: [
      ['Domain', 'Regulatory submissions and approval packages'],
      ['Type', 'Customer POC'],
      ['Period', 'Mar → May 2025'],
      ['My role', 'Built the agent workflow, the page prompts, the retrieval pipeline and the demo'],
      ['Status', 'POC with a hosted demo']
    ],
    problem: 'Regulatory submissions run to hundreds of pages with deep section hierarchies, and reviewers need to find a section and its pages quickly. Plain text extraction mixed up running headers, document codes and real section titles, so search pointed at the wrong places.',
    approach: [
      ['Agent workflow', 'An event-driven agent workflow with tools to extract page content and build the section JSON.'],
      ['Section hierarchy', 'Pydantic models for sections and sub-sections, so the output is always a valid tree.'],
      ['Layout-aware page prompts', 'Page number, title and section headers read from visual cues (size, position, style), with running headers and document codes ignored.'],
      ['PDF tooling', 'Text and layout from PDF libraries and a layout model, next to the vision model.'],
      ['Search', 'A retrieval pipeline over Elasticsearch with a custom node that calls an in-house vision-language model, behind a demo app.']
    ],
    fixes: [
      ['Running headers read as section titles', 'Prompts that use layout cues and explicitly ignore repeated headers and codes.'],
      ['Flat, inconsistent output', 'A typed section hierarchy, validated before indexing.'],
      ['Search landing on the wrong page', 'Sections indexed with their pages, and retrieval over those.']
    ],
    tech: ['Python', 'LlamaIndex AgentWorkflow', 'Pydantic', 'PyMuPDF / pdfplumber', 'LayoutParser', 'Haystack', 'Elasticsearch', 'Streamlit', 'PostgreSQL', 'Serverless GPU'],
    impact: ['A working demo that finds sections and their pages in long regulatory documents.'],
    learned: [
      'Layout is part of the meaning. Position and font size tell you what a heading is.',
      'Validate the structure before you index it.'
    ],
    posts: [], related: ['tender', 'largedocs'],
    flow: { title: 'filing → sections → search', steps: [
      { t: 'Filing in', c: 'A long regulatory submission arrives as a PDF.', o: 'submission.pdf' },
      { t: 'Read pages', c: 'Each page is read with layout cues: size, position, style.', o: 'page info' },
      { t: 'Drop noise', c: 'Running headers and document codes are ignored, not read as titles.', o: 'header ✖', warn: true },
      { t: 'Build the tree', c: 'Sections and sub-sections become one validated hierarchy.', o: '§ 2.3.1' },
      { t: 'Search', c: 'Sections are indexed with their pages, then searched.', o: '§ 2.3 · p.41 ✓' }
    ] }
  },
  {
    id: 'drawings', n: '13', yr: 2025, end: '2025-04', client: 'Indian engineering conglomerate',
    cats: ['document'], catLabel: 'Vision', status: 'proof', statusLabel: 'POC · demoed',
    title: 'Spot the difference: engineering drawings and a vision model',
    short: 'For an Indian engineering conglomerate: vision-model prompts that compare two mechanical drawings, or a drawing and a hand sketch, and list what changed. Plus reading truss, turbine, flange and cable-bridge diagrams.',
    hardq: 'Two revisions of a drawing look almost the same. How do you get a model to list exactly what changed, and where?',
    chips: ['Vision-language models', 'Prompt design', 'Engineering drawings'],
    fields: [
      ['Domain', 'Mechanical and structural drawings: CAD drawings, hand sketches, truss, turbine, flange and cable-bridge diagrams'],
      ['Type', 'Customer POC'],
      ['Period', 'Apr 2025'],
      ['My role', 'Built the comparison and diagram prompts and the demo'],
      ['Status', 'Demoed to the client’s team']
    ],
    problem: 'Engineers compare drawing revisions by eye: a changed dimension, a moved hole, a new note. They also read many kinds of technical diagrams. The client wanted to see whether vision models could do this on their own drawing types.',
    approach: [
      ['Pairwise comparison', 'Prompts that take two drawings, or a CAD drawing and a hand sketch, and list the differences region by region.'],
      ['Diagram reading', 'Prompts for truss, turbine, flange and cable-bridge diagrams that describe the components and how they connect.'],
      ['Checkable output', 'Each difference returned as a row (what, where, before, after) instead of free text.'],
      ['Demo', 'Built over two days and demoed on the client’s drawing types.']
    ],
    fixes: [
      ['Free-text answers that were hard to check', 'A fixed output shape: what changed, where, before, after.'],
      ['One prompt for every diagram type', 'Separate prompts per diagram family.']
    ],
    tech: ['Vision-language models', 'Prompt engineering', 'Python'],
    impact: ['The client saw their own drawing types compared and read by a vision model.'],
    learned: [
      'For vision models, the output format is half the prompt. Ask for a checkable list, not a description.',
      'Different drawing families need their own instructions.'
    ],
    posts: [], related: ['copilot', 'platform'],
    flow: { title: 'drawing diff', steps: [
      { t: 'Two drawings', c: 'Revision A and revision B of a mechanical drawing (synthetic here).', o: 'rev A · rev B' },
      { t: 'Pair', c: 'Both go to the vision model side by side, with the regions to compare.', o: '2 images' },
      { t: 'Compare', c: 'The model lists the differences region by region.', o: '3 changes', warn: true },
      { t: 'Structure', c: 'Each difference becomes a row: what, where, before, after.', o: 'Ø12 → Ø14' },
      { t: 'Review', c: 'An engineer checks each row against the drawings.', o: 'confirmed', human: true }
    ] }
  },
  {
    id: 'timesheets', n: '14', yr: 2025, end: '2025-04', client: 'US disaster-response staffing firm',
    cats: ['document'], catLabel: 'Handwriting', status: 'proof', statusLabel: 'POC',
    title: 'Handwritten timesheets from disaster sites',
    short: 'Crews fill and sign paper timesheets in the field: names, signatures, phone numbers, odometer readings, tick columns. Fixed-schema table extraction with a vision model, tested on synthetic handwriting with known answers.',
    hardq: 'No real data to test on, and every row is handwritten. How do you show the extraction works?',
    chips: ['Vision LLM', 'Synthetic handwriting', 'Streamlit', 'Serverless GPU'],
    fields: [
      ['Domain', 'Field timesheets: scanned, handwritten, signed tables'],
      ['Type', 'Customer POC'],
      ['Period', 'Mar → Apr 2025'],
      ['My role', 'Built the extraction prompts, the image pre-processing, the demo UI and the synthetic-data generator'],
      ['Status', 'POC']
    ],
    problem: 'During disaster response, crews fill and sign timesheets by hand: name, signature, phone, odometer start and end, and tick-style columns. The scans are messy, the handwriting varies, and real samples can’t be passed around for testing. The firm needed the tables read into data.',
    approach: [
      ['Fixed-schema table prompts', 'The columns are known in advance, so the prompt asks for exactly those keys for every row.'],
      ['Image pre-processing', 'Pages split and cropped at 300 dpi before extraction.'],
      ['Synthetic handwriting', 'The form rebuilt as an HTML template and filled with handwriting-style fonts, to make test samples whose answers are known.'],
      ['Demo', 'A Streamlit app calling a serverless GPU endpoint.']
    ],
    fixes: [
      ['No shareable test data', 'Synthetic samples generated from an HTML replica of the form, so every value is known.'],
      ['Rows drifting across columns', 'A fixed key list per row instead of open-ended table extraction.'],
      ['Poor scans', 'Split and crop at 300 dpi before the model sees the page.']
    ],
    tech: ['Python', 'Vision LLMs (hosted and self-hosted)', 'Streamlit', 'Serverless GPU endpoint', 'HTML templates + handwriting fonts', 'Image pre-processing'],
    impact: ['A working POC on the firm’s timesheet layout, with test data whose answers are known.'],
    learned: [
      'When you can’t use real data, rebuild the form and generate data whose answers you already know.',
      'If the columns are fixed, say so in the prompt.'
    ],
    posts: [], related: ['health', 'platform'],
    flow: { title: 'timesheet → rows', steps: [
      { t: 'Scan in', c: 'A signed, handwritten timesheet arrives as a scan.', o: 'timesheet.pdf' },
      { t: 'Prepare', c: 'Pages are split and cropped at 300 dpi.', o: '300 dpi crops' },
      { t: 'Extract rows', c: 'A vision model fills a fixed set of keys for every row.', o: '8 rows × 7 keys' },
      { t: 'Check', c: 'Values are compared with synthetic samples whose answers are known.', o: 'diff vs truth' },
      { t: 'Export', c: 'Rows go out as structured data.', o: 'rows.json ✓' }
    ] }
  },
  {
    id: 'showcase', n: '15', yr: 2025, end: '2025-04', client: 'Industry technology event',
    cats: ['document'], catLabel: 'Showcase', status: 'delivered', statusLabel: 'Shown live',
    title: 'Ten live document-AI demos on one page',
    short: 'I built the showcase page for an industry technology event: ten live use cases, from handwritten key-values to chat with a document. The same year, the agentic document-intelligence work was shown at a national startup event and an industry conference.',
    hardq: '',
    chips: ['Live demos', 'Vision models', 'Detection models'],
    fields: [
      ['Domain', 'Document AI demos for an external audience'],
      ['Type', 'Event showcase'],
      ['Period', 'Apr 2025 (plus events in Apr and Nov 2025)'],
      ['My role', 'Built the page of ten live demos; showcased the platform at a startup event and travelled to an industry conference'],
      ['Status', 'Shown live']
    ],
    problem: 'For an industry technology event, the team needed one place to show what the document platform could do, live, across many document types and elements.',
    approach: [
      ['Ten use cases', 'Printed and handwritten key-values, faces, checkboxes, tables, figures, chat with a document, currency, payment terms, paragraphs and résumés.'],
      ['One page', 'Each use case as a live demo against the platform’s services.'],
      ['Events', 'Agentic document intelligence shown at a national startup event (Apr 2025) and an industry conference (Nov 2025).']
    ],
    fixes: [],
    tech: ['Python services', 'Vision-language models', 'Detection models', 'Web front end'],
    impact: ['Ten capabilities shown live, in one place, to external audiences.'],
    learned: ['A good demo shows a familiar document going in and checkable values coming out, in seconds.'],
    posts: [], related: ['platform', 'idp'],
    flow: { title: 'showcase · 10 demos', steps: [
      { t: 'Pick a demo', c: 'Ten use cases on one page, from key-values to chat with a document.', o: '10 demos' },
      { t: 'Upload', c: 'A sample document goes in.', o: 'form.png' },
      { t: 'Extract', c: 'The matching service reads it.', o: 'KVP · table' },
      { t: 'Show', c: 'Values appear next to the document, each with its box.', o: '12 fields ✓' }
    ] }
  },
  {
    id: 'serving', n: '16', yr: 2025, end: '2025-10', client: 'In-house document AI platform, for several clients',
    cats: ['serving'], catLabel: 'Serving & infra', status: 'internal', statusLabel: 'Platform work',
    title: 'Serving vision models on GPUs, from Triton to serverless',
    short: 'The infrastructure under the document models: Triton and ONNX, an on-prem Kubernetes GPU cluster built with Terraform, serverless GPU endpoints with an autoscaling utility, vLLM tuning, and cost reports a customer can read.',
    hardq: 'A 72B vision model takes minutes to load and GPUs bill by the hour. How do you serve it without paying for idle time?',
    chips: ['Triton', 'vLLM', 'Kubernetes', 'Terraform', 'Serverless GPU'],
    fields: [
      ['Domain', 'Model serving and GPU infrastructure for document AI'],
      ['Type', 'Platform engineering'],
      ['Period', 'Jun 2024 → Oct 2025'],
      ['My role', 'Set up and tuned serving, built the autoscaling utility, wrote the cost and time reports'],
      ['Status', 'Used across client deliveries']
    ],
    problem: 'Vision-language models for documents are large, slow to load and expensive to keep running. Clients needed different setups: an on-prem cluster, their own cloud, or pay-per-use GPUs. Each choice had to be measured for speed, accuracy and cost.',
    approach: [
      ['Triton + ONNX', 'Models served with Triton, including encoder/decoder ONNX exports and a vision-language model with explicit load and inference APIs.'],
      ['On-prem cluster', 'Kubernetes provisioned with Terraform (master and worker nodes), the NVIDIA device plugin and drivers, documented for the team.'],
      ['Big models on small GPUs', 'Model parallelism for a 40 GB model across three single-GPU machines with DeepSpeed inference.'],
      ['Serverless GPUs', 'Endpoints with network volumes to cut cold-start load time, request batching per worker, and a Java utility that computes the right worker count and updates the endpoint by API. Plus a design for predictive scaling from weekly load.'],
      ['vLLM tuning', 'Quantized (AWQ) models, batching limits and multimodal settings, chosen by measured accuracy as well as speed.'],
      ['Cost you can read', 'Per-pipeline cost and time reports (documents, pages, prompts, GPU time, storage) and a customer TCO workbook.'],
      ['Small and edge models', '1–2B vision-language models exported to ONNX for edge devices, and a TPU trial with PyTorch/XLA.']
    ],
    fixes: [
      ['Minutes-long cold starts', 'Model weights on network volumes instead of downloads at start-up.'],
      ['Paying for idle GPUs', 'A worker-autoscaling utility, and a design for predictive scaling.'],
      ['A 40 GB model on single-GPU machines', 'Model parallelism across machines.'],
      ['Huge container images', 'Image layers reworked for a 72B-model server.'],
      ['Customers asking what it costs', 'Per-pipeline cost and time reports and a TCO workbook.']
    ],
    tech: ['Triton', 'ONNX Runtime', 'vLLM', 'AWQ', 'DeepSpeed', 'Kubernetes', 'Terraform', 'NVIDIA device plugin', 'Docker', 'Serverless GPUs', 'Java (autoscaling utility)', 'PyTorch/XLA (TPU)', 'Cloud A100'],
    impact: [
      'Client deliveries could choose on-prem, client-cloud or pay-per-use serving, each with a measured cost.',
      'Serving decisions came with numbers attached.'
    ],
    learned: [
      'The cheapest GPU is the one that isn’t running. Design for cold starts and scaling down early.',
      'When you change the serving engine, measure accuracy, not only speed.'
    ],
    posts: [], related: ['pbm', 'copilot', 'health'],
    flow: { title: 'model → serving → cost', steps: [
      { t: 'Model', c: 'A large vision-language model, quantized where it helps.', o: 'AWQ · 4-bit' },
      { t: 'Package', c: 'Weights on a network volume; a lean container image.', o: 'image ↓' },
      { t: 'Serve', c: 'Triton or vLLM, with batching limits per worker.', o: 'batched' },
      { t: 'Scale', c: 'Workers follow the load, down to none when idle.', o: 'workers 3 → 0' },
      { t: 'Measure', c: 'Accuracy, time per page and cost per pipeline, side by side.', o: '$ / page' },
      { t: 'Report', c: 'A TCO workbook the customer can read.', o: 'TCO.xlsx ✓' }
    ] }
  },
  {
    id: 'voice', n: '17', yr: 2024, end: '2024-09', client: 'Task-management tools, then a postal-software company',
    cats: ['agentic'], catLabel: 'Voice agent', status: 'proof', statusLabel: 'POC · demoed',
    title: '“Move that card to Done”: a voice agent that acts',
    short: 'Say a command and it happens in your tools: speech to text, an LLM that turns the transcript into a structured command, and API calls you confirm first. Built for task boards, then pointed at parcel booking.',
    hardq: 'RAG over the API docs kept producing wrong calls. What should the LLM do, and what should it never do?',
    chips: ['Whisper', 'Mistral-7B', 'Redis', 'Streamlit'],
    fields: [
      ['Domain', 'Voice commands for task boards and parcel booking'],
      ['Type', 'Product POC'],
      ['Period', 'May → Sep 2024'],
      ['My role', 'Designed and built the pipeline, the API layer and the UI'],
      ['Status', 'Demoed, with an improvement plan']
    ],
    problem: 'Teams update task boards during stand-ups by hand. The idea: say “move the login bug to Done” and have it happen, in whichever tool the team uses. The first version used RAG over the tool’s API documentation to write the API calls, and those calls were often wrong.',
    approach: [
      ['Speech to text', 'Audio transcribed with Whisper.'],
      ['Command extraction', 'An open LLM turns the transcript into a structured command: board, action, card, destination.'],
      ['State', 'Commands kept in Redis, then in PostgreSQL (workspace, audio, board and card tables).'],
      ['Calling the API', 'First RAG over the API documentation to build calls; then IDs resolved by lookups and calls made through a client library.'],
      ['Confirm before acting', 'A Streamlit UI with a recorder, history, sign-in and an editable confirmation step.'],
      ['A second domain', 'The same core pointed at a parcel platform’s API spec (locations, bookings, authentication) for booking by voice.']
    ],
    fixes: [
      ['Wrong generated API calls', 'The LLM only extracts the command; a client library makes the call.'],
      ['Similar endpoints retrieved', 'No more endpoint retrieval; IDs are resolved with lookups.'],
      ['Acting on a misheard command', 'An editable confirmation step before anything runs.'],
      ['RAG limits on API docs', 'Wrote down the failure points (retrieval quality, chunking JSON docs, how many results to fetch) and tried fine-tuning as an alternative.']
    ],
    tech: ['Python', 'OpenAI Whisper', 'Mistral-7B (multi-GPU)', 'Redis', 'PostgreSQL', 'REST APIs + client libraries', 'Streamlit', 'OAuth'],
    impact: [
      'A working voice-to-action demo on task boards, extended to a second platform.',
      'A written analysis of where RAG fails on API documentation.'
    ],
    learned: [
      'An agent that acts needs a confirm step, not just a better prompt.',
      'Let the model understand; let code act.'
    ],
    posts: [], related: ['finetune', 'bid'],
    flow: { title: 'voice → action', steps: [
      { t: 'Speak', c: '“Move the login bug to Done.”', o: 'audio · 3 s' },
      { t: 'Transcribe', c: 'Whisper turns the speech into text.', o: 'transcript' },
      { t: 'Understand', c: 'The LLM extracts a structured command.', o: '{ action: move }' },
      { t: 'Resolve', c: 'Board and card IDs are found by API lookups, not guessed.', o: 'card #A12' },
      { t: 'Confirm', c: 'The user checks and edits the command before it runs.', o: 'confirmed', human: true },
      { t: 'Act', c: 'A client library makes the call.', o: '✓ moved' }
    ] }
  },
  {
    id: 'finetune', n: '18', yr: 2024, end: '2024-08', client: 'In-house R&D (2024) · the market-research client (2025)',
    cats: ['serving'], catLabel: 'Fine-tuning', status: 'internal', statusLabel: 'R&D',
    title: 'Fine-tuning for narrow jobs: an open 7B model, then a cloud model',
    short: 'Two fine-tuning efforts: LoRA on an open 7B model with Stack Overflow Q&A after RAG fell short on API docs, and per-field training data for a cloud model to make email field extraction more consistent.',
    hardq: 'When should you fine-tune instead of fixing retrieval? And what will the training data cost before you even start?',
    chips: ['Unsloth', 'LoRA / QLoRA', 'Mistral-7B', 'Azure OpenAI'],
    fields: [
      ['Domain', 'Code-related Q&A; bid-email field extraction'],
      ['Type', 'R&D, then client work'],
      ['Period', 'Mar → Aug 2024 · Oct 2025'],
      ['My role', 'Built the training environments, the datasets, the training runs and the inference API'],
      ['Status', 'Experiments + a training-data pipeline']
    ],
    problem: 'RAG over API documentation kept retrieving the wrong endpoints, and some extraction fields came out differently from run to run. Both raised the same question: would a model trained on the narrow task behave more consistently than a general model with better context?',
    approach: [
      ['Open model, 2024', 'A 4-bit Mistral-7B-Instruct with Unsloth and LoRA / QLoRA on about 1,200 Stack Overflow question–answer rows kept in PostgreSQL.'],
      ['Serving the result', 'A FastAPI inference endpoint for the tuned model, and recovery for interrupted training runs.'],
      ['Cloud model, 2025', 'Per-field training questions generated by a ReAct agent from email images, each field’s prompt kept under 512 tokens.'],
      ['Before training', 'JSONL validated before upload, training images in cloud storage, and the image-token cost estimated first.']
    ],
    fixes: [
      ['Interrupted runs on a shared GPU server', 'Training resumed from checkpoints, and GPU memory handled in the async API.'],
      ['One long prompt for every field', 'Per-field prompts under 512 tokens.'],
      ['A platform limit', 'Checked image-input support and cost before committing: image inputs weren’t supported for fine-tuning the chosen model.']
    ],
    tech: ['Python', 'Unsloth', 'LoRA / QLoRA', 'Mistral-7B-Instruct (4-bit)', 'PostgreSQL', 'FastAPI', 'Azure OpenAI fine-tuning', 'ReAct agent (data generation)', 'Blob storage'],
    impact: [
      'A repeatable fine-tuning setup for open models, from dataset table to API.',
      'A clear, costed answer on whether cloud fine-tuning could take image inputs for the client task.'
    ],
    learned: [
      'Fine-tuning suits consistent behaviour on narrow tasks. RAG suits knowledge that changes.',
      'Check platform limits and cost before you build the dataset.'
    ],
    posts: [], related: ['voice', 'bid'],
    flow: { title: 'dataset → adapter → api', steps: [
      { t: 'Dataset', c: 'Question–answer rows collected into a dataset table.', o: '~1,200 rows' },
      { t: 'Format', c: 'Rows turned into instruction-style training examples.', o: 'JSONL' },
      { t: 'Train', c: 'LoRA adapters trained on a 4-bit 7B model.', o: 'adapters' },
      { t: 'Serve', c: 'The tuned model answers through a FastAPI endpoint.', o: 'POST /generate' },
      { t: 'Per-field data', c: 'In 2025 a ReAct agent wrote per-field training questions from email images.', o: '1 field · <512 tok' },
      { t: 'Check first', c: 'JSONL validated, image-token cost estimated, platform limits checked.', o: 'image input ✖', warn: true }
    ] }
  },
  {
    id: 'invoices', n: '19', yr: 2024, end: '2024-05', client: 'SaaS workflow partner and two of its prospects',
    cats: ['document', 'backend'], catLabel: 'Integrations', status: 'delivered', statusLabel: 'Demoed · live webhook',
    title: 'Quotations and invoices, read inside a partner’s platform',
    short: 'I was the main technical contact for a SaaS workflow partner: payment-terms extraction with an open LLM, multi-header tables, currency detection, and a webhook that pushed results into their platform.',
    hardq: 'An invoice table has two header rows and a currency nobody wrote out. How do you still map every column?',
    chips: ['Mistral-7B', 'YOLOv8', 'PaddleOCR', 'Webhooks'],
    fields: [
      ['Domain', 'Fit-out quotations, supplier invoices and payment terms, for prospects in retail fit-out (Middle East) and finance (UK)'],
      ['Type', 'Partner integration + customer POCs'],
      ['Period', 'Jan → May 2024'],
      ['My role', 'Main technical contact for the integration: extraction services, table logic, the webhook and deployment'],
      ['Status', 'Demoed to prospects; the outbound webhook went live in Feb 2024']
    ],
    problem: 'The partner’s customers sent quotations and invoices in many layouts: upside-down scans, tables with several header rows, mixed currencies, non-Latin text. Payment terms were buried in paragraphs. Results had to land inside the partner’s platform automatically, not in a separate tool.',
    approach: [
      ['OCR + orientation', 'PaddleOCR and doctr, with orientation detection to fix pages scanned upside down.'],
      ['Payment terms with an open LLM', 'A Mistral-7B-Instruct prompt that returns payment-term sections as JSON from a FastAPI endpoint, with a regex baseline to compare against.'],
      ['Tables', 'YOLOv8 table detection, header-row detection and splitting for multi-header invoices, header matching by string similarity, and a table confidence score.'],
      ['Currency', 'Symbol lists and fuzzy matching, with non-Latin text kept intact.'],
      ['Webhook + validation', 'For the finance prospect: invoice header fields checked against a purchase-order lookup and pushed by an outbound webhook into the partner platform. The same webhook was reused for the second prospect.'],
      ['Deployment', 'Jenkins jobs so the team no longer needed machine access, a cloud VM, and GPU-ready Docker images.']
    ],
    fixes: [
      ['Pages scanned upside down', 'Orientation detection before OCR.'],
      ['Multi-row table headers', 'Detect and split the header rows, then match headers by similarity, with a confidence score.'],
      ['Payment terms buried in prose', 'An LLM prompt with a fixed JSON shape, checked against a regex baseline.'],
      ['Manual hand-off of results', 'An outbound webhook into the partner platform.']
    ],
    tech: ['Python', 'FastAPI', 'Mistral-7B-Instruct', 'PaddleOCR / doctr', 'Tesseract OSD', 'YOLOv8', 'String similarity (difflib)', 'Webhooks', 'Docker', 'Jenkins', 'Cloud VM'],
    impact: [
      'Results flowed into the partner’s platform through a live webhook.',
      'Demos on prospects’ document types in two countries.'
    ],
    learned: [
      'Integration is part of the product. A result that lands in the customer’s own tool gets used.',
      'Keep a simple baseline next to the LLM, so you know what the model adds.'
    ],
    posts: [], related: ['platform', 'pbm'],
    flow: { title: 'invoice → partner platform', steps: [
      { t: 'Document in', c: 'A quotation or invoice arrives through the partner platform.', o: 'invoice.pdf' },
      { t: 'OCR', c: 'Orientation fixed, then text read with OCR.', o: '180° fixed' },
      { t: 'Tables', c: 'Tables detected, header rows split and matched.', o: '2 header rows' },
      { t: 'Terms + currency', c: 'Payment terms come out as JSON; the currency is detected.', o: '30% advance · AED' },
      { t: 'Validate', c: 'Header fields are checked against purchase orders.', o: 'PO ✓' },
      { t: 'Webhook', c: 'Results are pushed back into the partner platform.', o: '200 OK ✓' }
    ] }
  },
  {
    id: 'idp', n: '20', yr: 2023, end: '2023-06', client: 'In-house product',
    cats: ['early', 'document'], catLabel: 'Early product', status: 'prod', statusLabel: 'Release 3.0 · production',
    title: 'Any document: handwriting, faces and QR codes on open-source models',
    short: 'Release 3.0 widened the platform from a few form types to documents in general: Django to FastAPI, handwriting with Donut, faces, QR codes and checkboxes, built by integrating open-source models instead of paying for a cloud service.',
    hardq: 'When the input can be any document, is the hard part still the model, or the routing?',
    chips: ['Donut', 'FastAPI', 'VGG16', 'OpenCV'],
    fields: [
      ['Domain', 'General documents: forms, IDs, invoices and more'],
      ['Type', 'In-house product'],
      ['Period', 'Jan → Jun 2023'],
      ['My role', 'Worked on the model integration, the Django → FastAPI migration and the element pipelines, including handwriting with Donut'],
      ['Status', 'Release 3.0 in production and in client demos']
    ],
    problem: 'Release 3.0 had to handle documents in general, which meant many more element types (handwriting, faces, QR codes), still without relying on a paid cloud service.',
    approach: [
      ['Open-source models', 'Donut, VGG16, DETR, Tesseract and others integrated behind one platform.'],
      ['FastAPI', 'The backend moved from Django to FastAPI for an async, API-first service.'],
      ['One pipeline per element', 'Key-values and tables from release 2.0; checkboxes and image classification with VGG16; handwriting with Donut; face detection on IDs; QR detection and decoding.'],
      ['Shared pre-processing', 'OpenCV and Tesseract in front of the models, with Pandas to assemble the output.']
    ],
    fixes: [
      ['More element types, more models', 'Route each element to its own pipeline, then merge the results.'],
      ['Handwriting', 'Donut, an OCR-free document transformer, for detection and recognition.']
    ],
    tech: ['Python', 'FastAPI', 'Donut', 'DETR', 'VGG16', 'OpenCV', 'Tesseract OCR', 'Pandas', 'Camelot'],
    impact: [
      'Release 3.0 went to production and into client demos.',
      'The platform where the US healthcare client work began.'
    ],
    learned: [
      'Going from “forms in three domains” to “any document” turned model accuracy into system design: routing and merging.',
      'Donut was my first OCR-free transformer, the bridge to the vision-language models I use today.'
    ],
    posts: [], related: ['templates', 'pbm', 'platform'],
    flow: { title: 'any document → json', steps: [
      { t: 'Any document', c: 'A form, an ID card, an invoice.', o: 'id-card.png' },
      { t: 'Find elements', c: 'Text, tables, checkboxes, handwriting, faces, QR codes.', o: '6 element types' },
      { t: 'Route', c: 'Each element goes to its own pipeline.', o: 'Donut · VGG16 · DETR' },
      { t: 'Merge', c: 'One structured output for the whole document.', o: 'doc.json ✓' }
    ] }
  },
  {
    id: 'templates', n: '21', yr: 2022, end: '2023-01', client: 'In-house product',
    cats: ['early', 'document'], catLabel: 'Early product', status: 'early', statusLabel: 'Release 2.0',
    title: 'Templates, DETR tables and a VGG16 checkbox model',
    short: 'Release 2.0 aimed at the big cloud document-AI services: template onboarding for licences, invoices and forms, with a pretrained open-weight transformer model for key-values, a DETR table model I attempted to train, a VGG16 checkbox classifier, and computer-vision engineering for image regions.',
    hardq: 'How do you compete with cloud document-AI services when a new customer wants to start this week?',
    chips: ['Open-weight transformer', 'DETR', 'VGG16', 'OpenCV'],
    fields: [
      ['Domain', 'Driving licences, invoices, insurance and financial forms, appraisal reports'],
      ['Type', 'In-house product'],
      ['Period', 'Aug 2022 → Jan 2023'],
      ['My role', 'Developer on the ML core: templates, the DETR table model, the VGG16 checkbox model, the object detector'],
      ['Status', 'Release 2.0; grew into the production platform (release 3.0)']
    ],
    problem: 'The same pain as release 1.0, with a bigger goal: a product that could stand next to the cloud document-AI services. That meant quick onboarding for common document types, and models that worked across customers instead of one per field.',
    approach: [
      ['Key-values', 'Instead of training an ACP model per field, a pretrained open-weight model with a transformer backbone.'],
      ['Template onboarding', 'Ready field sets per document type (driving licences, invoices, insurance and financial forms), so a customer starts from a template.'],
      ['Tables', 'Attempted training a DETR (detection transformer) table model, with Camelot for digital PDFs.'],
      ['Checkboxes', 'A VGG16 classifier trained in-house.'],
      ['Image regions', 'Classical computer-vision engineering (OpenCV) to find and crop photos and fields on licences and images in appraisal reports, with no model to train.'],
      ['Backend', 'Django, with Tesseract OCR and OpenCV pre-processing in front of the models.']
    ],
    fixes: [
      ['One model per field (release 1.0)', 'Pretrained open-weight model for key-values, CV engineering for images, training only for tables and checkboxes; plus templates.'],
      ['Slow onboarding', 'Ready templates for common document types.']
    ],
    tech: ['Python', 'Django', 'PyTorch', 'Open-weight transformer model', 'DETR', 'VGG16', 'Tesseract OCR', 'OpenCV', 'Camelot'],
    impact: ['Release 2.0 grew into the production platform (release 3.0).'],
    learned: [
      'Customers compare onboarding speed and template coverage, not only model accuracy.',
      'Knowing each specialised model’s job is why I can explain where LLM-based extraction helps and where it doesn’t.'
    ],
    posts: [], related: ['formx', 'idp', 'platform'],
    flow: { title: 'template extraction', steps: [
      { t: 'Template', c: 'Pick a template: licence, invoice, insurance or financial form.', o: 'template · invoice' },
      { t: 'Pre-process', c: 'OCR and OpenCV clean-up.', o: 'OCR text' },
      { t: 'Route', c: 'Key-values, DETR tables, VGG16 checkboxes, a detector for image regions.', o: '4 models' },
      { t: 'Assemble', c: 'Results are merged into the template’s fields.', o: 'fields.json ✓' }
    ] }
  },
  {
    id: 'formx', n: '22', yr: 2022, end: '2022-08', client: 'In-house product',
    cats: ['early', 'document'], catLabel: 'Early product', status: 'early', statusLabel: 'Release 1.0 · internal',
    title: 'My first product: a form extractor, one model per field',
    short: 'Release 1.0 of an in-house form-extraction product for health-insurance, loan and appraisal forms. I joined as an intern on the UI and backend, then moved into data labelling, training and serving the extraction models.',
    hardq: 'Every new field needed its own model. What does that teach you about designing extraction?',
    chips: ['Attend-Copy-Parse (ACP)', 'Spring Boot', 'Vaadin', 'Python serving'],
    fields: [
      ['Domain', 'Health-insurance, loan and commercial-appraisal forms'],
      ['Type', 'In-house product'],
      ['Period', 'Jan → Aug 2022'],
      ['My role', 'Intern → developer: Vaadin UI and Spring Boot backend, then data labelling, model training, serving and evaluation'],
      ['Status', 'Release 1.0 shipped internally; not taken to production']
    ],
    problem: 'Health insurers, lenders and commercial appraisers needed data out of forms without paying for manual entry. Off-the-shelf tools didn’t adapt to each domain’s custom layouts, and appraisal reports also carried information inside photos.',
    approach: [
      ['Extraction model (ACP)', 'Based on the “Attend, Copy, Parse” (ACP) paper: attend over the text, copy the relevant tokens, parse them into a normalised value.'],
      ['One model per entity', 'Each field (patient name, loan amount…) had its own model, so a domain could add fields for its forms.'],
      ['Document handling', 'Key-value pairs, tables, images, and correction of rotated or skewed pages before extraction.'],
      ['Product', 'A Python model service behind a Spring Boot backend, with a Vaadin web UI to upload forms and review fields.']
    ],
    fixes: [
      ['Every new field needed a new model', 'The next release moved to one model per extraction type, plus templates.'],
      ['A product customers didn’t adopt', 'Learned to check product fit with design partners before building models.']
    ],
    tech: ['Java', 'Spring Boot', 'Vaadin', 'Python', 'Attend-Copy-Parse (ACP)', 'Data labelling', 'Model training', 'OCR'],
    impact: [
      'Release 1.0 covered health-insurance, lending and appraisal forms.',
      'It didn’t go to production; the next release was redesigned around what it taught us.'
    ],
    learned: [
      'Check product fit before investing in models.',
      'One model per field scales poorly. Today I’d use one layout-aware extractor with a configurable schema.',
      'Seeing the whole system early (UI → backend → serving → training data) is what moved me from full-stack into AI.'
    ],
    posts: [], related: ['templates', 'idp', 'platform'],
    flow: { title: 'form → fields', steps: [
      { t: 'Form in', c: 'A scanned claim, loan or appraisal form.', o: 'form.png' },
      { t: 'Fix the page', c: 'Rotation and skew are corrected.', o: 'deskewed' },
      { t: 'Per-field models', c: 'One model per field reads its value.', o: '6 models' },
      { t: 'Review', c: 'Fields are shown in the web UI for review.', o: 'reviewed', human: true }
    ] }
  }
];

/* Smaller builds and experiments: listed on the projects page, no page of their own.
   rel = the project page it belongs with, if any. */
window.BRIEFS = [
  { yr: 2026, title: 'Java agent with Embabel and Spring AI', line: 'An agent demo on the JVM, built with Embabel and Spring AI.', tags: ['Java', 'Spring AI', 'Agents'] },
  { yr: 2025, title: 'Prompt management system', line: 'Prompts versioned in a database or in files, with validation and a written structure every prompt follows.', tags: ['Prompt ops', 'Versioning'], rel: 'bid' },
  { yr: 2025, title: 'Telecom document-ingestion POC', line: 'For a telecom company’s centre of excellence: property and architecture documents ingested with chunk summaries and confidence scores.', tags: ['Ingestion', 'Confidence'] },
  { yr: 2025, title: 'Forms and timesheets with checkboxes', line: 'For a US company: table and checkbox extraction, tested on a 72B vision-language model.', tags: ['Checkboxes', 'Vision LLM'], rel: 'platform' },
  { yr: 2025, title: 'Edge-device POCs', line: 'Document AI on kiosk and edge devices for several customers; small vision-language models exported to ONNX.', tags: ['Edge', 'ONNX'], rel: 'serving' },
  { yr: 2025, title: 'Per-tenant cost tracking', line: 'Usage and cost tracked per tenant API key on the document platform.', tags: ['Platform', 'Cost'], rel: 'serving' },
  { yr: 2025, title: 'RAG starter service', line: 'Upload documents and ask questions: FastAPI, sentence-transformer embeddings, Qdrant and a hosted LLM.', tags: ['RAG', 'Qdrant', 'FastAPI'] },
  { yr: 2025, title: 'Sales-call assistant (design)', line: 'Data model, API and call-transcription tests for automating sales calls.', tags: ['FastAPI', 'Speech'] },
  { yr: 2024, title: 'Low-code platform integration', line: 'Files uploaded from a low-code app, processed by the platform, with results posted back by webhook into a live table.', tags: ['Webhooks', 'Integration'], rel: 'invoices' },
  { yr: 2024, title: 'CI/CD assistant', line: 'Trigger build jobs, poll their status and fetch logs by API, and clone repositories for a code-generation tool.', tags: ['Jenkins API', 'GitPython'] },
  { yr: 2024, title: 'Customer-feedback sentiment analyzer', line: 'Bank customer reviews grouped by theme for each survey, in a Streamlit app.', tags: ['NLP', 'Streamlit'] },
  { yr: 2024, title: 'Rule-aligned prediction', line: 'Classical ML aligned with business rules: feature selection, LassoCV and random forests.', tags: ['scikit-learn'] },
  { yr: 2024, title: 'Cloud OCR and ID analysis in Java', line: 'Text, tables and ID-document fields through a cloud OCR SDK, returned as JSON.', tags: ['Java', 'Cloud OCR'] },
  { yr: 2024, title: 'Demos for healthcare and insurance prospects', line: 'Face and figure detection, handwritten key-values and checkbox demos for healthcare and vision-insurance prospects.', tags: ['Demos', 'Vision'], rel: 'platform' },
  { yr: 2023, title: 'Medical diagnosis search', line: 'Elasticsearch indices for diagnoses and categories, with exact, fuzzy, multi-field and wildcard search.', tags: ['Elasticsearch'] },
  { yr: 2023, title: 'Java platform modules', line: 'Configuration and pipeline-audit APIs for the document platform, with Mockito tests.', tags: ['Java', 'Spring Boot', 'Hibernate'] }
];
