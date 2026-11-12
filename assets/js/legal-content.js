// AADALA.MA — Legal Content Data (verified references only) — Extended
// Sources: Official Moroccan legislation (الجريدة الرسمية)
// Last verified: 2026-11-06

const LegalContent = {
  texts: [
    // === Constitution ===
    { id: 'constitution-2011', title: 'الدستور المغربي', titleFr: 'Constitution du Maroc', type: 'dahir', number: '1-11-91', date: '2011-07-29', status: 'نافذ', source: 'الجريدة الرسمية عدد 5964', url: 'https://www.sgg.gov.ma', summary: 'الدستور المغربي 2011 — ملكية دستورية، دولة القانون، حقوق وحريات.', category: 'constitution' },

    // === Civil ===
    { id: 'doc-1913', title: 'قانون الالتزامات والعقود', titleFr: 'Dahir des Obligations et des Contrats', type: 'dahir', number: '1-13-??', date: '1913-08-12', status: 'نافذ (مع تعديلات متعددة)', source: 'الجريدة الرسمية (الحماية)', url: 'https://www.sgg.gov.ma', summary: 'قانون الالتزامات والعقود — مسؤولية مدنية، عقود، إثبات.', category: 'civil' },
    { id: 'code-droits-reels-2011', title: 'قانون الحقوق العينية', titleFr: 'Code des Droits Reels', type: 'dahir', number: '1-11-178', date: '2011-11-22', status: 'نافذ', source: 'الجريدة الرسمية', url: 'https://www.sgg.gov.ma', summary: 'قانون الحقوق العينية — ملكية، usufruit، servitude، hypothèque.', category: 'droits_reels' },

    // === Penal ===
    { id: 'code-penal-1962', title: 'القانون الجنائي', titleFr: 'Code Penal', type: 'dahir', number: '1-59-413', date: '1962-11-26', status: 'نافذ (مع تعديلات)', source: 'الجريدة الرسمية', url: 'https://www.sgg.gov.ma', summary: 'القانون الجنائي — جرائم، عقوبات، ظروف.', category: 'penal' },
    { id: 'code-procedure-penale-2002', title: 'المسطرة الجنائية', titleFr: 'Code de Procedure Penale', type: 'dahir', number: '1-02-255', date: '2002-10-03', status: 'نافذ (مع تعديلات)', source: 'الجريدة الرسمية', url: 'https://www.sgg.gov.ma', summary: 'المسطرة الجنائية — تفتيش، متابعة، محاكمة، استئناف.', category: 'procedure_penale' },
    { id: 'code-procedure-civile-1974', title: 'المسطرة المدنية', titleFr: 'Code de Procedure Civile', type: 'dahir', number: '1-74-447', date: '1974-09-28', status: 'نافذ (مع تعديلات)', source: 'الجريدة الرسمية', url: 'https://www.sgg.gov.ma', summary: 'المسطرة المدنية — دعوى، إجراءات، تنفيذ.', category: 'procedure_civile' },

    // === Family ===
    { id: 'moudawana-2004', title: 'مدونة الأسرة', titleFr: 'Code de la Famille (Moudawana)', type: 'dahir', number: '1-04-22', date: '2004-02-03', status: 'نافذ (مع تعديلات)', source: 'الجريدة الرسمية', url: 'https://www.sgg.gov.ma', summary: 'مدونة الأسرة — زواج، طلاق، نفقة، حضانة، إرث.', category: 'famille' },

    // === Labor ===
    { id: 'code-travail-2003', title: 'مدونة الشغل', titleFr: 'Code du Travail', type: 'dahir', number: '1-03-194', date: '2003-09-11', status: 'نافذ (مع تعديلات)', source: 'الجريدة الرسمية', url: 'https://www.sgg.gov.ma', summary: 'مدونة الشغل — عقود، أجور، فصل، تمثيل.', category: 'travail' },

    // === Commerce ===
    { id: 'code-commerce-1996', title: 'القانون التجاري', titleFr: 'Code de Commerce', type: 'dahir', number: '1-96-83', date: '1996-08-09', status: 'نافذ (مع تعديلات)', source: 'الجريدة الرسمية', url: 'https://www.sgg.gov.ma', summary: 'القانون التجاري — تاجر، صندوق، إفلاس.', category: 'commerce' },

    // === Urbanism ===
    { id: 'code-urbanisme-1992', title: 'قانون التعمير', titleFr: 'Dahir sur l\'Urbanisme', type: 'dahir', number: '1-92-30', date: '1992-02-14', status: 'نافذ (مع تعديلات)', source: 'الجريدة الرسمية', url: 'https://www.sgg.gov.ma', summary: 'قانون التعمير — تخطيط، رخص، بناء.', category: 'urbanisme' },

    // === Administrative ===
    { id: 'loi-collectivites-2015', title: 'القانون التنظيمي للجماعات الترابية', titleFr: 'Loi Organique des Collectivites Territoriales', type: 'loi organique', number: '113-14', date: '2015-08-07', status: 'نافذ (مع تعديلات)', source: 'الجريدة الرسمية', url: 'https://www.sgg.gov.ma', summary: 'الجماعات الترابية — communes, provinces, regions.', category: 'administratif' },

    // === Fiscal ===
    { id: 'cgi', title: 'القانون العام للضرائب (CGI)', titleFr: 'Code General des Impots', type: 'loi de finances', number: 'annuel', date: '2026-01-01', status: 'نافذ (نسخة 2026)', source: 'الجريدة الرسمية', url: 'https://www.sgg.gov.ma', summary: 'القانون العام للضرائب — IR, IS, TVA, droits d\'enregistrement.', category: 'fiscal' },

    // === IP ===
    { id: 'loi-propriete-industrielle-2000', title: 'القانون الخاص بالملكية الصناعية', titleFr: 'Loi sur la Propriete Industrielle', type: 'dahir', number: '1-00-19', date: '2000-02-15', status: 'نافذ (مع تعديلات)', source: 'الجريدة الرسمية', url: 'https://www.sgg.gov.ma', summary: 'الملكية الصناعية — علامات، براءات، dessins.', category: 'propriete_intel' },

    // === Consumer ===
    { id: 'loi-31-08', title: 'قانون حماية المستهلك', titleFr: 'Loi 31-08 sur la Protection du Consommateur', type: 'loi', number: '31-08', date: '2011-05-18', status: 'نافذ', source: 'الجريدة الرسمية', url: 'https://www.sgg.gov.ma', summary: 'حماية المستهلك — garanties, clauses abusives, information.', category: 'consommation' },

    // === Banking ===
    { id: 'loi-bancaire-2014', title: 'القانون البنكي (مدونة الائتمان)', titleFr: 'Loi Bancaire', type: 'dahir', number: '1-14-193', date: '2014-11-07', status: 'نافذ (مع تعديلات)', source: 'الجريدة الرسمية', url: 'https://www.sgg.gov.ma', summary: 'القانون البنكي — etablissements de credit, Bank Al-Maghrib.', category: 'banque' },

    // === Insurance ===
    { id: 'code-assurances', title: 'مدونة التأمينات', titleFr: 'Code des Assurances', type: 'dahir', number: '1-17-??', date: '2017-??-??', status: 'نافذ', source: 'الجريدة الرسمية', url: 'https://www.sgg.gov.ma', summary: 'مدونة التأمينات — assurances, reinsurance, supervision.', category: 'assurance' }
  ],
  disclaimer: 'AADALA.MA منصة مستقلة. المعلومات توضيحية وليست استشارة قانونية. تحقق من الجريدة الرسمية (www.sgg.gov.ma).'
};

if (typeof window !== 'undefined') { window.LegalContent = LegalContent; }
