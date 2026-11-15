from investigation_matcher import match_investigation

test_cases = [
    ("CBC", "Complete Blood Count"),
    ("ESR", "Erythrocyte Sedimentation Rate"),
    ("CXR-PA view", "Chest X-Ray Posteroanterior View"),
    ("Widal", "Widal Test"),
    ("Urine R/E", "Urine Routine Examination"),
    ("Typhidot-IgM/IgG", "Typhidot IgM and IgG Test"),
    ("SGOT/SGPT", "Serum Glutamic Oxaloacetic Transaminase / Serum Glutamic Pyruvic Transaminase"),
    ("Blgr", "Blood Grouping"),
    ("HIV", "Human Immunodeficiency Virus Test"),
    ("Anti-HCV", "Anti-Hepatitis C Virus Antibody"),
    ("ECG", "Electrocardiogram"),
    ("Coagulation Profile", "Coagulation Profile"),
    ("USG lower abdomen", "Ultrasonography Lower Abdomen"),
    ("S. PRL", "Serum Prolactin"),
    ("PPS. Insulin", "Postprandial Serum Insulin"),
    ]

for raw_name, standard_name in test_cases:
    result = match_investigation(raw_name, standard_name)

    print(f"\nInput: {raw_name}")
    print(f"Canonical: {result['canonical_name']}")
    print(f"Score: {result['match_score']}")
    print(f"Match status: {result['match_status']}")
    print(f"Matched: {result['matched']}")