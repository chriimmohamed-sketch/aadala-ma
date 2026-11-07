-- ==========================================================
-- إنشاء قاعدة بيانات للموقع القانوني المغربي
-- Database: Moroccan_Law_DB
-- ==========================================================

-- 1. جدول القوانين والمدونات
CREATE TABLE IF NOT EXISTS laws (
    law_id SERIAL PRIMARY KEY,
    law_name VARCHAR(255) NOT NULL,
    document_type VARCHAR(100),
    year_issued INT,
    issuing_authority VARCHAR(150),
    source_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. جدول الأقسام والأبواب والفصول
CREATE TABLE IF NOT EXISTS sections (
    section_id SERIAL PRIMARY KEY,
    law_id INT NOT NULL,
    parent_id INT NULL,
    section_title VARCHAR(255) NOT NULL,
    level INT,
    order_index INT,
    FOREIGN KEY (law_id) REFERENCES laws(law_id) ON DELETE CASCADE,
    FOREIGN KEY (parent_id) REFERENCES sections(section_id) ON DELETE CASCADE
);

-- 3. جدول المواد والفصول القانونية (النصوص الحرفية)
CREATE TABLE IF NOT EXISTS articles (
    article_id SERIAL PRIMARY KEY,
    section_id INT NOT NULL,
    article_number VARCHAR(50) NOT NULL,
    full_text TEXT NOT NULL,
    summary TEXT,
    keywords JSONB,
    penalties_effects TEXT,
    FOREIGN KEY (section_id) REFERENCES sections(section_id) ON DELETE CASCADE
);

-- 4. جدول الإشكاليات والأسئلة القانونية
CREATE TABLE IF NOT EXISTS legal_issues (
    issue_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    main_category VARCHAR(100),
    sub_category VARCHAR(100),
    search_keywords TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. جدول الربط بين الإشكاليات والمواد القانونية
CREATE TABLE IF NOT EXISTS issue_article_mapping (
    issue_id INT NOT NULL,
    article_id INT NOT NULL,
    relation_type VARCHAR(100),
    PRIMARY KEY (issue_id, article_id),
    FOREIGN KEY (issue_id) REFERENCES legal_issues(issue_id) ON DELETE CASCADE,
    FOREIGN KEY (article_id) REFERENCES articles(article_id) ON DELETE CASCADE
);

-- 6. جدول الكيانات القانونية
CREATE TABLE IF NOT EXISTS entities (
    entity_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100),
    definition TEXT
);

-- 7. جدول الربط بين الكيانات والمواد القانونية
CREATE TABLE IF NOT EXISTS entity_article_mapping (
    entity_id INT NOT NULL,
    article_id INT NOT NULL,
    role VARCHAR(100),
    PRIMARY KEY (entity_id, article_id),
    FOREIGN KEY (entity_id) REFERENCES entities(entity_id) ON DELETE CASCADE,
    FOREIGN KEY (article_id) REFERENCES articles(article_id) ON DELETE CASCADE
);

-- 8. جدول الإجابات المرجعية
CREATE TABLE IF NOT EXISTS reference_answers (
    answer_id SERIAL PRIMARY KEY,
    issue_id INT NOT NULL,
    answer_text TEXT NOT NULL,
    cited_articles JSONB,
    source VARCHAR(150),
    FOREIGN KEY (issue_id) REFERENCES legal_issues(issue_id) ON DELETE CASCADE
);

-- ==========================================================
-- فهارس (Indexes)
-- ==========================================================
CREATE INDEX IF NOT EXISTS idx_articles_full_text ON articles USING gin(to_tsvector('arabic', full_text));
CREATE INDEX IF NOT EXISTS idx_issues_title ON legal_issues(title);
CREATE INDEX IF NOT EXISTS idx_laws_name ON laws(law_name);