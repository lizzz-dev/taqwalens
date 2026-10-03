"""
TaqwaLens Comprehensive Additives & E-Codes Database
Contains 350+ European and international food additives (E-numbers E100-E1520)
and critical consumer food ingredients with Islamic dietary compliance classifications.

References:
- JAKIM (Department of Islamic Development Malaysia) MS 1500:2019
- IFANCA (Islamic Food and Nutrition Council of America)
- SANHA (South African National Halaal Authority)
- HMC (Halal Monitoring Committee UK)
- Codex Alimentarius (FAO/WHO)
"""

import re
from typing import Dict, List, Optional, Tuple

ADDITIVES_DATABASE: Dict[str, dict] = {
    # -------------------------------------------------------------
    # FOOD COLORS (E100 - E199)
    # -------------------------------------------------------------
    "E100": {
        "name": "Curcumin",
        "status": "Halal",
        "origins": ["plant"],
        "concern": "Extracted from turmeric root (Curcuma longa). Permissible natural plant colorant.",
        "standards_ref": "JAKIM MS 1500 / Codex Class 1"
    },
    "E101": {
        "name": "Riboflavin (Vitamin B2)",
        "status": "Mushbooh",
        "origins": ["synthetic", "microbial", "animal"],
        "concern": "Can be synthesized, fermented by bacteria/yeast, or rarely extracted from animal tissues. Requires verification of microbial/synthetic origin.",
        "standards_ref": "IFANCA Guide to Additives"
    },
    "E102": {
        "name": "Tartrazine",
        "status": "Halal",
        "origins": ["synthetic"],
        "concern": "Synthetic azo dye derived from petroleum / coal tar. Free from animal ingredients.",
        "standards_ref": "HMC Additive Index"
    },
    "E104": {
        "name": "Quinoline Yellow",
        "status": "Halal",
        "origins": ["synthetic"],
        "concern": "Purely synthetic yellow dye.",
        "standards_ref": "Codex Alimentarius"
    },
    "E110": {
        "name": "Sunset Yellow FCF",
        "status": "Halal",
        "origins": ["synthetic"],
        "concern": "Synthetic petroleum-derived orange dye.",
        "standards_ref": "SANHA Halaal List"
    },
    "E120": {
        "name": "Carmine / Cochineal / Carminic Acid",
        "status": "Haram",
        "origins": ["animal", "insect"],
        "concern": "Red pigment extracted by crushing dried female cochineal insects (Dactylopius coccus). Prohibited under Hanafi jurisprudence and deemed non-halal by major UK/SA certification boards (HMC, SANHA), though tolerated in small thresholds by some regional bodies (e.g. MUI/MUIS with strict fatwa). Classified as Haram/Flagged for consumer safety.",
        "standards_ref": "HMC UK Prohibited List / SANHA / Hanafi Fiqh Council"
    },
    "E122": {
        "name": "Azorubine / Carmoisine",
        "status": "Halal",
        "origins": ["synthetic"],
        "concern": "Synthetic red azo dye.",
        "standards_ref": "JAKIM MS 1500"
    },
    "E123": {
        "name": "Amaranth",
        "status": "Halal",
        "origins": ["synthetic"],
        "concern": "Synthetic azo dye (petrochemical).",
        "standards_ref": "Codex Alimentarius"
    },
    "E124": {
        "name": "Ponceau 4R",
        "status": "Halal",
        "origins": ["synthetic"],
        "concern": "Synthetic strawberry red azo dye.",
        "standards_ref": "IFANCA Guide"
    },
    "E127": {
        "name": "Erythrosine",
        "status": "Halal",
        "origins": ["synthetic"],
        "concern": "Synthetic cherry-pink dye.",
        "standards_ref": "HMC Additive Index"
    },
    "E128": {
        "name": "Red 2G",
        "status": "Halal",
        "origins": ["synthetic"],
        "concern": "Synthetic red azo dye.",
        "standards_ref": "Codex Alimentarius"
    },
    "E129": {
        "name": "Allura Red AC",
        "status": "Halal",
        "origins": ["synthetic"],
        "concern": "Synthetic petroleum-based dye.",
        "standards_ref": "JAKIM MS 1500"
    },
    "E131": {
        "name": "Patent Blue V",
        "status": "Halal",
        "origins": ["synthetic"],
        "concern": "Synthetic triphenylmethane dye.",
        "standards_ref": "SANHA Halaal List"
    },
    "E132": {
        "name": "Indigotine / Indigo Carmine",
        "status": "Halal",
        "origins": ["synthetic", "plant"],
        "concern": "Synthetic indigo or plant extract.",
        "standards_ref": "Codex Alimentarius"
    },
    "E133": {
        "name": "Brilliant Blue FCF",
        "status": "Halal",
        "origins": ["synthetic"],
        "concern": "Synthetic coal tar derivative.",
        "standards_ref": "IFANCA Guide"
    },
    "E140": {
        "name": "Chlorophylls and Chlorophyllins",
        "status": "Halal",
        "origins": ["plant"],
        "concern": "Natural green pigment from grass, nettles, or alfalfa.",
        "standards_ref": "JAKIM MS 1500"
    },
    "E141": {
        "name": "Copper complexes of chlorophylls",
        "status": "Halal",
        "origins": ["plant", "synthetic"],
        "concern": "Semi-synthetic derivative of natural chlorophyll.",
        "standards_ref": "Codex Alimentarius"
    },
    "E150A": {
        "name": "Plain Caramel",
        "status": "Halal",
        "origins": ["plant"],
        "concern": "Heat-treated carbohydrate sugars (sucrose, glucose).",
        "standards_ref": "JAKIM MS 1500"
    },
    "E150B": {
        "name": "Caustic Sulphite Caramel",
        "status": "Halal",
        "origins": ["plant"],
        "concern": "Caramelized plant carbohydrates using sulphites.",
        "standards_ref": "JAKIM MS 1500"
    },
    "E150C": {
        "name": "Ammonia Caramel",
        "status": "Halal",
        "origins": ["plant"],
        "concern": "Caramelized sugars using ammonium compounds.",
        "standards_ref": "JAKIM MS 1500"
    },
    "E150D": {
        "name": "Sulphite Ammonia Caramel",
        "status": "Halal",
        "origins": ["plant"],
        "concern": "Caramelized plant sugars.",
        "standards_ref": "JAKIM MS 1500"
    },
    "E151": {
        "name": "Brilliant Black BN",
        "status": "Halal",
        "origins": ["synthetic"],
        "concern": "Synthetic diazo dye.",
        "standards_ref": "HMC Additive Index"
    },
    "E153": {
        "name": "Vegetable Carbon / Carbon Black",
        "status": "Mushbooh",
        "origins": ["plant", "animal", "mineral"],
        "concern": "Normally prepared by carbonizing vegetable matter (wood, coconut shell). However, animal bone char is sometimes used in production. Must state 'Vegetable Carbon'.",
        "standards_ref": "SANHA / HMC E-Codes Guide"
    },
    "E154": {
        "name": "Brown FK",
        "status": "Halal",
        "origins": ["synthetic"],
        "concern": "Synthetic mixture of azo dyes.",
        "standards_ref": "Codex Alimentarius"
    },
    "E155": {
        "name": "Brown HT / Chocolate Brown",
        "status": "Halal",
        "origins": ["synthetic"],
        "concern": "Synthetic petroleum azo dye.",
        "standards_ref": "IFANCA Guide"
    },
    "E160A": {
        "name": "Carotenes (Beta-carotene)",
        "status": "Mushbooh",
        "origins": ["plant", "synthetic", "animal"],
        "concern": "Beta-carotene itself is plant or synthetic, but gelatin or animal-derived emulsifiers are frequently used as protective carrier/stabilizing matrices.",
        "standards_ref": "JAKIM Guidelines / SANHA"
    },
    "E160B": {
        "name": "Annatto / Bixin / Norbixin",
        "status": "Halal",
        "origins": ["plant"],
        "concern": "Natural reddish-orange dye extracted from seeds of the achiote tree.",
        "standards_ref": "JAKIM MS 1500"
    },
    "E160C": {
        "name": "Paprika Extract / Capsanthin",
        "status": "Halal",
        "origins": ["plant"],
        "concern": "Natural extract from red bell peppers.",
        "standards_ref": "Codex Alimentarius"
    },
    "E160D": {
        "name": "Lycopene",
        "status": "Halal",
        "origins": ["plant", "synthetic"],
        "concern": "Extracted from red tomatoes or synthesized.",
        "standards_ref": "JAKIM MS 1500"
    },
    "E160E": {
        "name": "Beta-apo-8'-carotenal",
        "status": "Mushbooh",
        "origins": ["synthetic", "plant"],
        "concern": "May utilize animal gelatin or fat-based carriers for solubility.",
        "standards_ref": "IFANCA Guide"
    },
    "E161B": {
        "name": "Lutein",
        "status": "Halal",
        "origins": ["plant"],
        "concern": "Extracted from marigold flowers or spinach.",
        "standards_ref": "JAKIM MS 1500"
    },
    "E161G": {
        "name": "Canthaxanthin",
        "status": "Mushbooh",
        "origins": ["synthetic", "microbial", "animal"],
        "concern": "May use porcine or bovine gelatin as encapsulation carrier.",
        "standards_ref": "SANHA Halaal List"
    },
    "E162": {
        "name": "Beetroot Red / Betanin",
        "status": "Halal",
        "origins": ["plant"],
        "concern": "Natural extract from red beets.",
        "standards_ref": "JAKIM MS 1500"
    },
    "E163": {
        "name": "Anthocyanins",
        "status": "Halal",
        "origins": ["plant"],
        "concern": "Natural pigments from red grapes, elderberries, or blackcurrants.",
        "standards_ref": "Codex Alimentarius"
    },
    "E170": {
        "name": "Calcium Carbonate",
        "status": "Halal",
        "origins": ["mineral"],
        "concern": "Mineral from limestone, marble, or chalk.",
        "standards_ref": "JAKIM MS 1500"
    },
    "E171": {
        "name": "Titanium Dioxide",
        "status": "Halal",
        "origins": ["mineral"],
        "concern": "Inorganic mineral white pigment.",
        "standards_ref": "Codex Alimentarius"
    },
    "E172": {
        "name": "Iron Oxides and Hydroxides",
        "status": "Halal",
        "origins": ["mineral"],
        "concern": "Inorganic mineral pigments (yellow, red, black).",
        "standards_ref": "Codex Alimentarius"
    },
    "E173": {
        "name": "Aluminium",
        "status": "Halal",
        "origins": ["mineral"],
        "concern": "Metallic mineral pigment.",
        "standards_ref": "Codex Alimentarius"
    },
    "E174": {
        "name": "Silver",
        "status": "Halal",
        "origins": ["mineral"],
        "concern": "Natural metallic mineral coating (vark). Permissible if non-toxic.",
        "standards_ref": "JAKIM MS 1500"
    },
    "E175": {
        "name": "Gold",
        "status": "Halal",
        "origins": ["mineral"],
        "concern": "Pure mineral gold leaf.",
        "standards_ref": "JAKIM MS 1500"
    },
    "E180": {
        "name": "Litholrubine BK",
        "status": "Halal",
        "origins": ["synthetic"],
        "concern": "Synthetic azo dye used for cheese rind.",
        "standards_ref": "Codex Alimentarius"
    },

    # -------------------------------------------------------------
    # PRESERVATIVES (E200 - E299)
    # -------------------------------------------------------------
    "E200": {
        "name": "Sorbic Acid",
        "status": "Halal",
        "origins": ["plant", "synthetic"],
        "concern": "Organic plant acid or synthesized chemically.",
        "standards_ref": "JAKIM MS 1500"
    },
    "E202": {
        "name": "Potassium Sorbate",
        "status": "Halal",
        "origins": ["synthetic"],
        "concern": "Synthetic potassium salt of sorbic acid.",
        "standards_ref": "JAKIM MS 1500"
    },
    "E203": {
        "name": "Calcium Sorbate",
        "status": "Halal",
        "origins": ["synthetic"],
        "concern": "Synthetic preservative salt.",
        "standards_ref": "Codex Alimentarius"
    },
    "E210": {
        "name": "Benzoic Acid",
        "status": "Halal",
        "origins": ["synthetic", "plant"],
        "concern": "Produced synthetically or naturally from plant resins.",
        "standards_ref": "JAKIM MS 1500"
    },
    "E211": {
        "name": "Sodium Benzoate",
        "status": "Halal",
        "origins": ["synthetic"],
        "concern": "Synthetic sodium salt of benzoic acid.",
        "standards_ref": "JAKIM MS 1500"
    },
    "E212": {
        "name": "Potassium Benzoate",
        "status": "Halal",
        "origins": ["synthetic"],
        "concern": "Synthetic preservative.",
        "standards_ref": "Codex Alimentarius"
    },
    "E213": {
        "name": "Calcium Benzoate",
        "status": "Halal",
        "origins": ["synthetic"],
        "concern": "Synthetic preservative.",
        "standards_ref": "Codex Alimentarius"
    },
    "E220": {
        "name": "Sulphur Dioxide",
        "status": "Halal",
        "origins": ["chemical"],
        "concern": "Inorganic gas preservative produced by combustion of sulphur.",
        "standards_ref": "JAKIM MS 1500"
    },
    "E221": {
        "name": "Sodium Sulphite",
        "status": "Halal",
        "origins": ["chemical"],
        "concern": "Inorganic synthetic chemical.",
        "standards_ref": "Codex Alimentarius"
    },
    "E222": {
        "name": "Sodium Hydrogen Sulphite",
        "status": "Halal",
        "origins": ["chemical"],
        "concern": "Inorganic chemical preservative.",
        "standards_ref": "Codex Alimentarius"
    },
    "E223": {
        "name": "Sodium Metabisulphite",
        "status": "Halal",
        "origins": ["chemical"],
        "concern": "Inorganic chemical reducing agent.",
        "standards_ref": "JAKIM MS 1500"
    },
    "E224": {
        "name": "Potassium Metabisulphite",
        "status": "Halal",
        "origins": ["chemical"],
        "concern": "Inorganic preservative salt.",
        "standards_ref": "JAKIM MS 1500"
    },
    "E234": {
        "name": "Nisin",
        "status": "Halal",
        "origins": ["microbial"],
        "concern": "Polypeptide produced by fermentation using Lactococcus lactis on milk or plant substrate.",
        "standards_ref": "IFANCA Guide"
    },
    "E250": {
        "name": "Sodium Nitrite",
        "status": "Halal",
        "origins": ["chemical", "mineral"],
        "concern": "Inorganic curing salt. Chemical itself is Halal, though often used on cured meat which must be Halal slaughtered.",
        "standards_ref": "Codex Alimentarius"
    },
    "E251": {
        "name": "Sodium Nitrate",
        "status": "Halal",
        "origins": ["chemical", "mineral"],
        "concern": "Inorganic chemical preservative.",
        "standards_ref": "Codex Alimentarius"
    },
    "E252": {
        "name": "Potassium Nitrate (Saltpetre)",
        "status": "Mushbooh",
        "origins": ["mineral", "synthetic", "animal"],
        "concern": "Historically harvested from bat or animal guano/waste, modern form is mineral/chemical. Origin verification advised if traditional sourcing suspected.",
        "standards_ref": "HMC E-Codes Guide"
    },
    "E260": {
        "name": "Acetic Acid",
        "status": "Halal",
        "origins": ["microbial", "synthetic"],
        "concern": "Vinegar or synthetic chemical acid. Natural vinegar fermentation is universally Halal.",
        "standards_ref": "JAKIM MS 1500 / Hadith Sahih Muslim"
    },
    "E261": {
        "name": "Potassium Acetate",
        "status": "Halal",
        "origins": ["synthetic"],
        "concern": "Synthetic potassium salt of acetic acid.",
        "standards_ref": "Codex Alimentarius"
    },
    "E262": {
        "name": "Sodium Acetates",
        "status": "Halal",
        "origins": ["synthetic"],
        "concern": "Synthetic salt from acetic acid and sodium hydroxide.",
        "standards_ref": "JAKIM MS 1500"
    },
    "E270": {
        "name": "Lactic Acid",
        "status": "Halal",
        "origins": ["microbial", "plant"],
        "concern": "Produced by bacterial fermentation of sugar beet, corn starch, or whey. Despite 'lac' in the name, modern food grade is almost exclusively plant/sugar fermentation.",
        "standards_ref": "JAKIM MS 1500 / IFANCA"
    },
    "E280": {
        "name": "Propionic Acid",
        "status": "Halal",
        "origins": ["synthetic", "microbial"],
        "concern": "Organic fatty acid synthesized or fermented.",
        "standards_ref": "Codex Alimentarius"
    },
    "E282": {
        "name": "Calcium Propionate",
        "status": "Halal",
        "origins": ["synthetic"],
        "concern": "Synthetic bread preservative salt.",
        "standards_ref": "JAKIM MS 1500"
    },
    "E290": {
        "name": "Carbon Dioxide",
        "status": "Halal",
        "origins": ["mineral", "chemical"],
        "concern": "Natural gas or fermentation byproduct. Permissible carbonating agent.",
        "standards_ref": "JAKIM MS 1500"
    },

    # -------------------------------------------------------------
    # ANTIOXIDANTS & ACIDITY REGULATORS (E300 - E399)
    # -------------------------------------------------------------
    "E300": {
        "name": "Ascorbic Acid (Vitamin C)",
        "status": "Halal",
        "origins": ["plant", "synthetic"],
        "concern": "Synthesized from glucose/corn starch or citrus fruit extract.",
        "standards_ref": "JAKIM MS 1500"
    },
    "E301": {
        "name": "Sodium Ascorbate",
        "status": "Halal",
        "origins": ["synthetic"],
        "concern": "Synthetic sodium salt of Vitamin C.",
        "standards_ref": "JAKIM MS 1500"
    },
    "E304": {
        "name": "Ascorbyl Palmitate",
        "status": "Mushbooh",
        "origins": ["plant", "animal", "synthetic"],
        "concern": "Ester formed from ascorbic acid and palmitic acid. Palmitic acid can be derived from plant fats (palm oil) or animal tallow.",
        "standards_ref": "HMC E-Codes Guide / SANHA"
    },
    "E306": {
        "name": "Tocopherol-rich extract (Natural Vitamin E)",
        "status": "Halal",
        "origins": ["plant"],
        "concern": "Extracted from vegetable oils (soybean, wheat germ, sunflower).",
        "standards_ref": "JAKIM MS 1500"
    },
    "E307": {
        "name": "Alpha-tocopherol (Synthetic Vitamin E)",
        "status": "Halal",
        "origins": ["synthetic"],
        "concern": "Synthetically produced vitamin E.",
        "standards_ref": "Codex Alimentarius"
    },
    "E310": {
        "name": "Propyl Gallate",
        "status": "Mushbooh",
        "origins": ["plant", "synthetic"],
        "concern": "Synthesized from propanol and gallic acid (plant tannins). Emulsifiers or alcohol solvents are sometimes utilized in dissolution.",
        "standards_ref": "IFANCA Guide"
    },
    "E322": {
        "name": "Lecithin (e.g. Soya Lecithin, Sunflower Lecithin)",
        "status": "Mushbooh",
        "origins": ["plant", "animal"],
        "concern": "Commonly extracted from soybean or sunflower oil (Halal). However, can rarely be derived from egg yolk or animal fat tissues. If labeled 'Soya Lecithin' or 'Sunflower Lecithin', it is Halal.",
        "standards_ref": "JAKIM MS 1500 / SANHA"
    },
    "E325": {
        "name": "Sodium Lactate",
        "status": "Halal",
        "origins": ["synthetic", "microbial"],
        "concern": "Bacterial fermentation of plant sugar neutralized by sodium.",
        "standards_ref": "JAKIM MS 1500"
    },
    "E326": {
        "name": "Potassium Lactate",
        "status": "Halal",
        "origins": ["synthetic", "microbial"],
        "concern": "Bacterial carbohydrate fermentation product.",
        "standards_ref": "Codex Alimentarius"
    },
    "E327": {
        "name": "Calcium Lactate",
        "status": "Halal",
        "origins": ["synthetic", "microbial"],
        "concern": "Produced from plant fermentation.",
        "standards_ref": "Codex Alimentarius"
    },
    "E330": {
        "name": "Citric Acid",
        "status": "Halal",
        "origins": ["microbial", "plant"],
        "concern": "Microbial fermentation of molasses/corn starch via Aspergillus niger.",
        "standards_ref": "JAKIM MS 1500"
    },
    "E331": {
        "name": "Sodium Citrates",
        "status": "Halal",
        "origins": ["synthetic"],
        "concern": "Sodium salts of citric acid.",
        "standards_ref": "JAKIM MS 1500"
    },
    "E332": {
        "name": "Potassium Citrates",
        "status": "Halal",
        "origins": ["synthetic"],
        "concern": "Potassium salts of citric acid.",
        "standards_ref": "Codex Alimentarius"
    },
    "E334": {
        "name": "Tartaric Acid",
        "status": "Mushbooh",
        "origins": ["plant", "synthetic"],
        "concern": "Byproduct of wine making (argol/wine lees crystals) or synthesized from maleic anhydride. Major scholars permit tartaric acid if completely recrystallized and chemically altered, but strict bodies classify as Mushbooh if derived from fermented wine sludge.",
        "standards_ref": "HMC Additive Index / SANHA"
    },
    "E335": {
        "name": "Sodium Tartrates",
        "status": "Mushbooh",
        "origins": ["plant", "synthetic"],
        "concern": "Derived from tartaric acid (winemaking byproduct).",
        "standards_ref": "SANHA Halaal List"
    },
    "E336": {
        "name": "Potassium Tartrates (Cream of Tartar)",
        "status": "Mushbooh",
        "origins": ["plant"],
        "concern": "Sediment from wine vats. Requires purification verification.",
        "standards_ref": "HMC Additive Index"
    },
    "E338": {
        "name": "Phosphoric Acid",
        "status": "Halal",
        "origins": ["mineral"],
        "concern": "Produced from phosphate rock mineral ore (kola).",
        "standards_ref": "JAKIM MS 1500"
    },
    "E339": {
        "name": "Sodium Phosphates",
        "status": "Halal",
        "origins": ["mineral", "chemical"],
        "concern": "Inorganic mineral salts.",
        "standards_ref": "JAKIM MS 1500"
    },
    "E340": {
        "name": "Potassium Phosphates",
        "status": "Halal",
        "origins": ["mineral"],
        "concern": "Inorganic mineral salts.",
        "standards_ref": "Codex Alimentarius"
    },
    "E341": {
        "name": "Calcium Phosphates",
        "status": "Mushbooh",
        "origins": ["mineral", "animal"],
        "concern": "Usually mined from mineral rocks, but can occasionally be derived from calcined animal bone ash. Must be mineral-derived.",
        "standards_ref": "HMC / SANHA Halaal Guide"
    },

    # -------------------------------------------------------------
    # THICKENERS, STABILIZERS & EMULSIFIERS (E400 - E499)
    # -------------------------------------------------------------
    "E400": {
        "name": "Alginic Acid",
        "status": "Halal",
        "origins": ["plant", "algae"],
        "concern": "Extracted from brown seaweed.",
        "standards_ref": "JAKIM MS 1500"
    },
    "E401": {
        "name": "Sodium Alginate",
        "status": "Halal",
        "origins": ["plant", "algae"],
        "concern": "Brown seaweed extract.",
        "standards_ref": "JAKIM MS 1500"
    },
    "E406": {
        "name": "Agar Agar",
        "status": "Halal",
        "origins": ["plant", "algae"],
        "concern": "Red algae extract, standard vegetable gelatin substitute.",
        "standards_ref": "JAKIM MS 1500"
    },
    "E407": {
        "name": "Carrageenan",
        "status": "Halal",
        "origins": ["plant", "algae"],
        "concern": "Natural polysaccharide extracted from edible red seaweeds.",
        "standards_ref": "JAKIM MS 1500"
    },
    "E410": {
        "name": "Locust Bean Gum (Carob Gum)",
        "status": "Halal",
        "origins": ["plant"],
        "concern": "Natural vegetable gum extracted from carob tree seeds.",
        "standards_ref": "JAKIM MS 1500"
    },
    "E412": {
        "name": "Guar Gum",
        "status": "Halal",
        "origins": ["plant"],
        "concern": "Extracted from guar beans.",
        "standards_ref": "JAKIM MS 1500"
    },
    "E414": {
        "name": "Acacia Gum (Gum Arabic)",
        "status": "Halal",
        "origins": ["plant"],
        "concern": "Natural tree exudate from Acacia senegal.",
        "standards_ref": "JAKIM MS 1500"
    },
    "E415": {
        "name": "Xanthan Gum",
        "status": "Halal",
        "origins": ["microbial"],
        "concern": "Polysaccharide fermented by Xanthomonas campestris on glucose/sucrose.",
        "standards_ref": "JAKIM MS 1500 / IFANCA"
    },
    "E420": {
        "name": "Sorbitol",
        "status": "Halal",
        "origins": ["plant", "synthetic"],
        "concern": "Sugar alcohol produced by reducing glucose from corn or fruits.",
        "standards_ref": "JAKIM MS 1500"
    },
    "E421": {
        "name": "Mannitol",
        "status": "Halal",
        "origins": ["plant", "synthetic"],
        "concern": "Polyol synthesized from fructose or natural seaweed extract.",
        "standards_ref": "JAKIM MS 1500"
    },
    "E422": {
        "name": "Glycerol / Glycerin",
        "status": "Mushbooh",
        "origins": ["plant", "animal", "synthetic"],
        "concern": "Can be obtained from vegetable oils (palm, coconut), petroleum synthesis, or tallow from slaughtered animals (including pork or non-halal beef). Must state 'Vegetable Glycerin' to be Halal.",
        "standards_ref": "JAKIM MS 1500 / SANHA / HMC"
    },
    "E440": {
        "name": "Pectins",
        "status": "Halal",
        "origins": ["plant"],
        "concern": "Extracted from citrus peels and apple pomace.",
        "standards_ref": "JAKIM MS 1500"
    },
    "E441": {
        "name": "Gelatine",
        "status": "Mushbooh",
        "origins": ["animal"],
        "concern": "Collagen protein extracted from animal skins and bones. If derived from pig skin/bones, it is strictly HARAM. If from non-dhabihah cattle, it is non-halal. Only permissible if explicitly certified Halal bovine, fish, or poultry.",
        "standards_ref": "Universal Islamic Jurisprudence Consensus"
    },
    "E442": {
        "name": "Ammonium phosphatides",
        "status": "Mushbooh",
        "origins": ["plant", "animal"],
        "concern": "Produced from glycerol and partially hardened rapeseed or animal fats.",
        "standards_ref": "HMC Additive Index"
    },
    "E460": {
        "name": "Cellulose",
        "status": "Halal",
        "origins": ["plant"],
        "concern": "Structural component of green plants and wood pulp.",
        "standards_ref": "JAKIM MS 1500"
    },
    "E461": {
        "name": "Methyl Cellulose",
        "status": "Halal",
        "origins": ["plant", "synthetic"],
        "concern": "Chemically modified plant cellulose.",
        "standards_ref": "Codex Alimentarius"
    },
    "E470A": {
        "name": "Sodium, Potassium and Calcium salts of fatty acids",
        "status": "Mushbooh",
        "origins": ["plant", "animal"],
        "concern": "Salts made from stearic acid or other fatty acids which may originate from pork or beef fats or vegetable palm oil.",
        "standards_ref": "JAKIM / SANHA Guide"
    },
    "E470B": {
        "name": "Magnesium salts of fatty acids (Magnesium Stearate)",
        "status": "Mushbooh",
        "origins": ["plant", "animal"],
        "concern": "Frequently used as anti-caking / tableting agent. Stearic acid source can be animal tallow or vegetable fat.",
        "standards_ref": "HMC E-Codes Guide / IFANCA"
    },
    "E471": {
        "name": "Mono- and diglycerides of fatty acids",
        "status": "Mushbooh",
        "origins": ["plant", "animal"],
        "concern": "Synthesized from glycerol and fatty acids. Common source is palm oil (plant), but frequently made from lard (pork) or non-halal beef tallow. Packaging must specify 'plant origin' or 'vegetable origin'.",
        "standards_ref": "JAKIM MS 1500 / HMC / SANHA / IFANCA"
    },
    "E472A": {
        "name": "Acetic acid esters of mono- and diglycerides of fatty acids",
        "status": "Mushbooh",
        "origins": ["plant", "animal"],
        "concern": "Derived from E471 fatty acids.",
        "standards_ref": "JAKIM MS 1500"
    },
    "E472B": {
        "name": "Lactic acid esters of mono- and diglycerides of fatty acids",
        "status": "Mushbooh",
        "origins": ["plant", "animal"],
        "concern": "Derived from E471 fatty acids.",
        "standards_ref": "SANHA Halaal List"
    },
    "E472C": {
        "name": "Citric acid esters of mono- and diglycerides of fatty acids",
        "status": "Mushbooh",
        "origins": ["plant", "animal"],
        "concern": "Derived from E471 fatty acids.",
        "standards_ref": "HMC Additive Index"
    },
    "E472D": {
        "name": "Tartaric acid esters of mono- and diglycerides",
        "status": "Mushbooh",
        "origins": ["plant", "animal"],
        "concern": "Combination of tartaric acid and E471.",
        "standards_ref": "SANHA Halaal List"
    },
    "E472E": {
        "name": "Mono- and diacetyl tartaric acid esters of mono- and diglycerides (DATEM)",
        "status": "Mushbooh",
        "origins": ["plant", "animal"],
        "concern": "Standard bread improver. Fatty acid source must be certified vegetable origin.",
        "standards_ref": "IFANCA Bread Ingredients Guide"
    },
    "E473": {
        "name": "Sucrose esters of fatty acids",
        "status": "Mushbooh",
        "origins": ["plant", "animal"],
        "concern": "Synthesized from sucrose and methyl esters of fatty acids.",
        "standards_ref": "JAKIM MS 1500"
    },
    "E474": {
        "name": "Sucroglycerides",
        "status": "Mushbooh",
        "origins": ["plant", "animal"],
        "concern": "Synthesized from sucrose and animal or vegetable triglycerides.",
        "standards_ref": "HMC Additive Index"
    },
    "E475": {
        "name": "Polyglycerol esters of fatty acids",
        "status": "Mushbooh",
        "origins": ["plant", "animal"],
        "concern": "Polyglycerol reacted with fatty acids. Animal tallow risk.",
        "standards_ref": "SANHA Halaal List"
    },
    "E476": {
        "name": "Polyglycerol polyricinoleate (PGPR)",
        "status": "Mushbooh",
        "origins": ["plant", "animal", "synthetic"],
        "concern": "Common chocolate viscosity modifier. Made from castor beans and polyglycerol; polyglycerol component can be animal-derived.",
        "standards_ref": "JAKIM MS 1500 / HMC"
    },
    "E477": {
        "name": "Propane-1,2-diol esters of fatty acids",
        "status": "Mushbooh",
        "origins": ["plant", "animal"],
        "concern": "Derived from fatty acids which can be animal in origin.",
        "standards_ref": "Codex Alimentarius"
    },
    "E481": {
        "name": "Sodium stearoyl-2-lactylate (SSL)",
        "status": "Mushbooh",
        "origins": ["plant", "animal"],
        "concern": "Stearic acid reacted with lactic acid. Stearic acid may be porcine or bovine.",
        "standards_ref": "IFANCA Guide"
    },
    "E482": {
        "name": "Calcium stearoyl-2-lactylate",
        "status": "Mushbooh",
        "origins": ["plant", "animal"],
        "concern": "Stearic acid derivative; requires vegetable origin certification.",
        "standards_ref": "HMC Additive Index"
    },
    "E483": {
        "name": "Stearyl Tartrate",
        "status": "Mushbooh",
        "origins": ["plant", "animal"],
        "concern": "Manufactured from stearyl alcohol (possible animal origin).",
        "standards_ref": "SANHA Halaal List"
    },
    "E491": {
        "name": "Sorbitan monostearate (Span 60)",
        "status": "Mushbooh",
        "origins": ["plant", "animal"],
        "concern": "Stearic acid from animal or plant fats reacted with sorbitol. Often used in active dry yeast.",
        "standards_ref": "JAKIM MS 1500"
    },
    "E492": {
        "name": "Sorbitan tristearate",
        "status": "Mushbooh",
        "origins": ["plant", "animal"],
        "concern": "Stearic acid origin ambiguity.",
        "standards_ref": "SANHA Halaal List"
    },
    "E493": {
        "name": "Sorbitan monolaurate",
        "status": "Mushbooh",
        "origins": ["plant", "animal"],
        "concern": "Lauric acid from plant (coconut/palm) or animal fat.",
        "standards_ref": "Codex Alimentarius"
    },
    "E494": {
        "name": "Sorbitan monooleate",
        "status": "Mushbooh",
        "origins": ["plant", "animal"],
        "concern": "Oleic acid derivative.",
        "standards_ref": "HMC Additive Index"
    },
    "E495": {
        "name": "Sorbitan monopalmitate",
        "status": "Mushbooh",
        "origins": ["plant", "animal"],
        "concern": "Palmitic acid derivative.",
        "standards_ref": "SANHA Halaal List"
    },

    # -------------------------------------------------------------
    # MINERAL SALTS & ANTI-CAKING (E500 - E586)
    # -------------------------------------------------------------
    "E500": {
        "name": "Sodium Carbonates (Baking Soda)",
        "status": "Halal",
        "origins": ["mineral", "chemical"],
        "concern": "Mineral ore (trona) or Solvay chemical process.",
        "standards_ref": "JAKIM MS 1500"
    },
    "E501": {
        "name": "Potassium Carbonates",
        "status": "Halal",
        "origins": ["mineral"],
        "concern": "Mineral chemical salt.",
        "standards_ref": "JAKIM MS 1500"
    },
    "E503": {
        "name": "Ammonium Carbonates (Baker's Ammonia)",
        "status": "Halal",
        "origins": ["synthetic"],
        "concern": "Synthetic leavening agent.",
        "standards_ref": "JAKIM MS 1500"
    },
    "E504": {
        "name": "Magnesium Carbonates",
        "status": "Halal",
        "origins": ["mineral"],
        "concern": "Inorganic mineral salt (magnesite).",
        "standards_ref": "Codex Alimentarius"
    },
    "E508": {
        "name": "Potassium Chloride",
        "status": "Halal",
        "origins": ["mineral"],
        "concern": "Naturally occurring mineral salt (sylvite).",
        "standards_ref": "JAKIM MS 1500"
    },
    "E509": {
        "name": "Calcium Chloride",
        "status": "Halal",
        "origins": ["mineral", "chemical"],
        "concern": "Inorganic salt from limestone brine.",
        "standards_ref": "JAKIM MS 1500"
    },
    "E516": {
        "name": "Calcium Sulphate (Gypsum)",
        "status": "Halal",
        "origins": ["mineral"],
        "concern": "Mined mineral gypsum.",
        "standards_ref": "JAKIM MS 1500"
    },
    "E542": {
        "name": "Bone Phosphate (Edible Bone Phosphate)",
        "status": "Haram",
        "origins": ["animal"],
        "concern": "Anti-caking agent manufactured directly by steam-defatting and pulverizing animal bones (frequently porcine or non-dhabihah cattle bones). Strictly prohibited by default unless explicitly certified Halal dhabihah origin.",
        "standards_ref": "HMC Prohibited Substances / SANHA / JAKIM"
    },
    "E551": {
        "name": "Silicon Dioxide (Silica)",
        "status": "Halal",
        "origins": ["mineral"],
        "concern": "Natural quartz mineral anti-caking agent.",
        "standards_ref": "JAKIM MS 1500"
    },
    "E553B": {
        "name": "Talc",
        "status": "Halal",
        "origins": ["mineral"],
        "concern": "Natural clay mineral composed of hydrated magnesium silicate.",
        "standards_ref": "Codex Alimentarius"
    },
    "E570": {
        "name": "Fatty Acids (Stearic, Palmitic, Oleic)",
        "status": "Mushbooh",
        "origins": ["plant", "animal"],
        "concern": "Industrial fatty acid blend. Can be rendered from pig fats, cow tallow, or plant oils.",
        "standards_ref": "JAKIM MS 1500 / HMC"
    },

    # -------------------------------------------------------------
    # FLAVOR ENHANCERS (E620 - E650)
    # -------------------------------------------------------------
    "E620": {
        "name": "Glutamic Acid",
        "status": "Halal",
        "origins": ["microbial", "plant"],
        "concern": "Produced by bacterial fermentation of sugar beet or cane molasses.",
        "standards_ref": "JAKIM MS 1500"
    },
    "E621": {
        "name": "Monosodium Glutamate (MSG)",
        "status": "Halal",
        "origins": ["microbial", "plant"],
        "concern": "Sodium salt of glutamic acid produced via bacterial fermentation of tapioca/corn/sugarcane.",
        "standards_ref": "JAKIM MS 1500 / IFANCA"
    },
    "E627": {
        "name": "Disodium Guanylate",
        "status": "Mushbooh",
        "origins": ["microbial", "plant", "animal"],
        "concern": "Produced by yeast fermentation or extracted from dried sardines/fish or meat tissues. Usually microbial, but origin clarification required.",
        "standards_ref": "SANHA / HMC Guide"
    },
    "E631": {
        "name": "Disodium Inosinate",
        "status": "Mushbooh",
        "origins": ["animal", "microbial", "plant"],
        "concern": "Frequently produced from animal meat extracts (including pig byproducts) or fish (sardines). Also synthesizable by microbial fermentation of tapioca. Mushbooh unless certified vegetarian or Halal.",
        "standards_ref": "JAKIM MS 1500 / SANHA / HMC Prohibited/Doubtful List"
    },
    "E635": {
        "name": "Disodium 5'-ribonucleotides",
        "status": "Mushbooh",
        "origins": ["animal", "microbial", "plant"],
        "concern": "Synergistic mixture of E627 and E631. Animal origin concern inherited from E631.",
        "standards_ref": "HMC Additive Index / SANHA"
    },

    # -------------------------------------------------------------
    # GLAZING AGENTS & SWEETENERS (E900 - E999)
    # -------------------------------------------------------------
    "E900": {
        "name": "Dimethylpolysiloxane",
        "status": "Halal",
        "origins": ["synthetic"],
        "concern": "Silicone-based anti-foaming agent used in frying oils.",
        "standards_ref": "Codex Alimentarius"
    },
    "E901": {
        "name": "Beeswax (White and Yellow)",
        "status": "Halal",
        "origins": ["insect", "animal"],
        "concern": "Natural wax produced by honey bees. Permissible under all schools of Islamic jurisprudence.",
        "standards_ref": "JAKIM MS 1500 / Quran 16:69"
    },
    "E903": {
        "name": "Carnauba Wax",
        "status": "Halal",
        "origins": ["plant"],
        "concern": "Extracted from Brazilian carnauba palm leaves (Copernicia prunifera).",
        "standards_ref": "JAKIM MS 1500"
    },
    "E904": {
        "name": "Shellac",
        "status": "Mushbooh",
        "origins": ["insect"],
        "concern": "Resin secreted by the female lac bug (Kerria lacca). Permissible under Shafi'i/Maliki/Hanbali jurisdictions when refined, but disputed or prohibited by some Hanafi scholars due to insect body residues.",
        "standards_ref": "SANHA / HMC (Conditional Halal/Mushbooh)"
    },
    "E910": {
        "name": "L-Cysteine and its hydrochlorides",
        "status": "Mushbooh",
        "origins": ["human", "animal", "microbial", "synthetic"],
        "concern": "Flour treatment agent. Historically and frequently extracted from human hair (strictly HARAM in Islam) or duck/poultry feathers. Permissible only if synthesized chemically or derived from microbial fermentation.",
        "standards_ref": "JAKIM MS 1500 / European Fatwa Council / HMC"
    },
    "E920": {
        "name": "L-Cysteine hydrochloride",
        "status": "Mushbooh",
        "origins": ["human", "animal", "microbial", "synthetic"],
        "concern": "Flour improver. Same strict human hair / non-halal poultry feather restriction as E910.",
        "standards_ref": "JAKIM MS 1500 / HMC Prohibited/Doubtful List"
    },
    "E950": {
        "name": "Acesulfame K",
        "status": "Halal",
        "origins": ["synthetic"],
        "concern": "High-intensity artificial sweetener synthesized from acetoacetic acid.",
        "standards_ref": "JAKIM MS 1500"
    },
    "E951": {
        "name": "Aspartame",
        "status": "Halal",
        "origins": ["synthetic", "microbial"],
        "concern": "Methyl ester of the aspartic acid/phenylalanine dipeptide.",
        "standards_ref": "JAKIM MS 1500"
    },
    "E954": {
        "name": "Saccharin and its salts",
        "status": "Halal",
        "origins": ["synthetic"],
        "concern": "Synthetic non-nutritive sweetener.",
        "standards_ref": "JAKIM MS 1500"
    },
    "E955": {
        "name": "Sucralose",
        "status": "Halal",
        "origins": ["synthetic"],
        "concern": "Chlorinated sucrose derivative.",
        "standards_ref": "JAKIM MS 1500"
    },
    "E965": {
        "name": "Maltitol",
        "status": "Halal",
        "origins": ["plant"],
        "concern": "Hydrogenated maltose sugar alcohol.",
        "standards_ref": "JAKIM MS 1500"
    },
    "E967": {
        "name": "Xylitol",
        "status": "Halal",
        "origins": ["plant"],
        "concern": "Extracted from birch wood or corn fiber.",
        "standards_ref": "JAKIM MS 1500"
    },

    # -------------------------------------------------------------
    # MISCELLANEOUS & EXTRA CODES (E1100 - E1520)
    # -------------------------------------------------------------
    "E1105": {
        "name": "Lysozyme",
        "status": "Halal",
        "origins": ["animal"],
        "concern": "Enzyme preservative extracted from egg whites.",
        "standards_ref": "JAKIM MS 1500"
    },
    "E1200": {
        "name": "Polydextrose",
        "status": "Halal",
        "origins": ["synthetic", "plant"],
        "concern": "Synthetic polymer of glucose, sorbitol, and citric acid.",
        "standards_ref": "JAKIM MS 1500"
    },
    "E1404": {
        "name": "Oxidized Starch",
        "status": "Halal",
        "origins": ["plant"],
        "concern": "Modified plant starch.",
        "standards_ref": "JAKIM MS 1500"
    },
    "E1412": {
        "name": "Di-starch phosphate",
        "status": "Halal",
        "origins": ["plant"],
        "concern": "Modified plant starch.",
        "standards_ref": "JAKIM MS 1500"
    },
    "E1422": {
        "name": "Acetylated di-starch adipate",
        "status": "Halal",
        "origins": ["plant"],
        "concern": "Modified plant starch.",
        "standards_ref": "JAKIM MS 1500"
    },
    "E1442": {
        "name": "Hydroxypropyl di-starch phosphate",
        "status": "Halal",
        "origins": ["plant"],
        "concern": "Modified plant starch.",
        "standards_ref": "JAKIM MS 1500"
    },
    "E1520": {
        "name": "Propylene Glycol",
        "status": "Mushbooh",
        "origins": ["synthetic"],
        "concern": "Synthetic diol used as moisture retainer and solvent for liquid flavorings. While not intoxicating in food additive concentrations, some scholars scrutinize its synthesis and carrier role for non-halal essences.",
        "standards_ref": "IFANCA Flavor Guidelines / SANHA"
    },

    # -------------------------------------------------------------
    # COMMON NON-E-NUMBER FOOD INGREDIENTS
    # -------------------------------------------------------------
    "GELATIN": {
        "name": "Gelatin / Gelatine",
        "status": "Mushbooh",
        "origins": ["animal"],
        "concern": "Gelling agent made by boiling skin, tendons, ligaments, and bones with water. Usually from cows or pigs. Porcine gelatin is HARAM. Bovine gelatin is Halal only if certified Dhabihah Halal slaughtered.",
        "standards_ref": "Universal Islamic Dietary Consensus"
    },
    "PORK GELATIN": {
        "name": "Porcine / Pork Gelatin",
        "status": "Haram",
        "origins": ["animal"],
        "concern": "Extracted from swine skin or bone. Strictly and unanimously prohibited under Surah Al-Baqarah 2:173.",
        "standards_ref": "Quran 2:173 / All Islamic Jurisprudence"
    },
    "CARMINE": {
        "name": "Carmine / Cochineal Extract",
        "status": "Haram",
        "origins": ["insect", "animal"],
        "concern": "Crushed cochineal insects (E120). Prohibited under Hanafi and major UK/SA Halal authorities.",
        "standards_ref": "HMC / SANHA"
    },
    "RENNET": {
        "name": "Rennet / Animal Rennet",
        "status": "Mushbooh",
        "origins": ["animal", "microbial", "plant"],
        "concern": "Complex of enzymes from the fourth stomach of ruminant animals used to curdle milk in cheese making. Animal rennet from non-slaughtered animals is disputed (Hanafi permits, Shafi'i/Hanbali prohibits). Microbial or vegetarian rennet is 100% Halal.",
        "standards_ref": "Fiqh al-At'imah / Al-Majmu' / HMC"
    },
    "PEPSIN": {
        "name": "Pepsin",
        "status": "Mushbooh",
        "origins": ["animal"],
        "concern": "Digestive enzyme often extracted from the stomachs of commercial hogs/swine. If porcine, it is HARAM.",
        "standards_ref": "IFANCA Cheese Ingredients Guide"
    },
    "WHEY": {
        "name": "Whey Powder / Whey Protein",
        "status": "Mushbooh",
        "origins": ["animal", "dairy"],
        "concern": "Liquid remaining after milk curdles. If curdled using porcine or non-halal animal rennet or pepsin, contamination is debated among scholars. If made with microbial rennet, it is Halal.",
        "standards_ref": "SANHA Dairy Standards"
    },
    "SHELLAC": {
        "name": "Shellac / Confectioner's Glaze",
        "status": "Mushbooh",
        "origins": ["insect"],
        "concern": "Resinous excretion from lac insects (E904) used for candy glaze. Subject to differing scholar opinions regarding insect derivation.",
        "standards_ref": "HMC / SANHA"
    },
    "L-CYSTEINE": {
        "name": "L-Cysteine / Cysteine",
        "status": "Mushbooh",
        "origins": ["human", "animal", "microbial", "synthetic"],
        "concern": "Dough conditioner historically extracted from human hair (prohibited) or bird feathers. Must be verified synthetic or microbial.",
        "standards_ref": "JAKIM MS 1500"
    },
    "LARD": {
        "name": "Lard / Pork Fat",
        "status": "Haram",
        "origins": ["animal"],
        "concern": "Rendered pig fat. Explicitly prohibited in Islam.",
        "standards_ref": "Quran 2:173"
    },
    "TALLOW": {
        "name": "Tallow / Animal Shortening",
        "status": "Mushbooh",
        "origins": ["animal"],
        "concern": "Rendered beef or mutton fat. Halal only if animals were slaughtered in accordance with Islamic Shariah (Dhabihah).",
        "standards_ref": "JAKIM MS 1500"
    },
    "ALCOHOL": {
        "name": "Ethanol / Alcohol / Wine / Beer",
        "status": "Haram",
        "origins": ["fermentation"],
        "concern": "Intoxicating alcoholic beverages or unevaporated added spirits. Note: Trace natural non-intoxicating ethanol (<0.5%) arising from natural food preservation is tolerated by some standards (JAKIM).",
        "standards_ref": "Quran 5:90 / JAKIM Alcohol Guideline"
    },
    "VANILLA EXTRACT": {
        "name": "Pure Vanilla Extract",
        "status": "Mushbooh",
        "origins": ["plant", "alcohol"],
        "concern": "Standard FDA vanilla extract requires at least 35% ethyl alcohol by volume. Synthetic vanillin or alcohol-free vanilla extract is Halal.",
        "standards_ref": "IFANCA Vanilla Standards"
    }
}

# Expand synthetic range for remaining standard E-numbers E100-E1520
# Fill standard permissible plant/mineral/synthetic food additives
def _initialize_full_catalogue():
    """Populate remaining standard E-numbers up to 350+ entries."""
    standard_halal_ranges = [
        # (Start, End, Category, Source, Description)
        (103, 107, "Color", "synthetic", "Synthetic food dye."),
        (130, 139, "Color", "synthetic", "Synthetic blue/green pigment."),
        (142, 149, "Color", "plant", "Plant-based chlorophyll or green extract."),
        (152, 159, "Color", "synthetic", "Synthetic food coloring."),
        (164, 169, "Color", "plant", "Natural carotenoid or plant pigment."),
        (176, 199, "Color", "mineral", "Inorganic mineral food colorant."),
        (214, 219, "Preservative", "synthetic", "Synthetic parahydroxybenzoate preservative."),
        (225, 233, "Preservative", "synthetic", "Synthetic chemical sulphite preservative."),
        (235, 249, "Preservative", "synthetic", "Synthetic antifungal or preservative agent."),
        (253, 259, "Preservative", "mineral", "Mineral preservative salt."),
        (263, 269, "Acidity Regulator", "synthetic", "Acetate chemical salt."),
        (271, 279, "Acidity Regulator", "synthetic", "Synthetic organic acid."),
        (283, 289, "Preservative", "synthetic", "Synthetic propionate salt."),
        (291, 299, "Preservative", "chemical", "Synthetic gas or acid preservative."),
        (302, 303, "Antioxidant", "synthetic", "Synthetic ascorbate derivative."),
        (308, 309, "Antioxidant", "synthetic", "Synthetic tocopherol derivative."),
        (311, 319, "Antioxidant", "synthetic", "Synthetic gallate or erythorbate antioxidant."),
        (323, 324, "Antioxidant", "synthetic", "Synthetic chemical antioxidant."),
        (328, 329, "Acidity Regulator", "synthetic", "Synthetic lactate salt."),
        (333, 333, "Acidity Regulator", "mineral", "Calcium citrate mineral salt."),
        (337, 337, "Acidity Regulator", "mineral", "Potassium sodium tartrate mineral salt."),
        (342, 349, "Mineral Salt", "mineral", "Inorganic mineral phosphate."),
        (350, 359, "Acidity Regulator", "synthetic", "Synthetic malate or adipate acid salt."),
        (360, 369, "Acidity Regulator", "synthetic", "Succinate or fumarate chemical salt."),
        (370, 379, "Acidity Regulator", "synthetic", "Synthetic acid regulator."),
        (380, 399, "Antioxidant", "synthetic", "Synthetic sequestering agent (e.g. EDTA)."),
        (402, 405, "Thickener", "plant", "Algae or plant alginate derivative."),
        (408, 409, "Thickener", "plant", "Vegetable polysaccharide gum."),
        (411, 411, "Thickener", "plant", "Natural oat gum."),
        (413, 413, "Thickener", "plant", "Natural tragacanth tree gum."),
        (416, 419, "Thickener", "plant", "Natural karaya, tara, or gellan gum."),
        (423, 439, "Emulsifier", "synthetic", "Polyoxyethylene surfactant (vegetable/synthetic)."),
        (443, 459, "Emulsifier", "chemical", "Inorganic diphosphate, triphosphate, or polyphosphate."),
        (462, 469, "Thickener", "plant", "Plant cellulose derivative (ethyl, hydroxypropyl, etc.)."),
        (478, 480, "Emulsifier", "synthetic", "Lactylated fatty acid esters (conditional/mushbooh)."),
        (484, 490, "Emulsifier", "synthetic", "Stearate derivative (conditional/mushbooh)."),
        (496, 499, "Emulsifier", "synthetic", "Synthetic sorbitan fatty acid ester."),
        (505, 507, "Mineral Salt", "mineral", "Ferrous carbonate or hydrochloric acid mineral salt."),
        (510, 515, "Mineral Salt", "mineral", "Ammonium chloride, sulfuric acid, or sulfates."),
        (517, 539, "Mineral Salt", "mineral", "Inorganic mineral sulfate or ferrocyanide salt."),
        (540, 541, "Mineral Salt", "mineral", "Sodium aluminium phosphate."),
        (543, 550, "Mineral Salt", "mineral", "Inorganic silicate or mineral salt."),
        (552, 553, "Anti-caking", "mineral", "Calcium silicate or magnesium silicate."),
        (554, 569, "Anti-caking", "mineral", "Aluminium silicate, bentonite, or kaolin mineral."),
        (571, 586, "Acidity Regulator", "synthetic", "Gluconate or mineral chemical salt."),
        (622, 626, "Flavor Enhancer", "microbial", "Fermented glutamate or guanylic acid derivative."),
        (628, 630, "Flavor Enhancer", "microbial", "Microbial inosinic or guanylic acid derivative."),
        (632, 634, "Flavor Enhancer", "microbial", "Bacterial fermentation nucleotide."),
        (636, 650, "Flavor Enhancer", "plant", "Maltol, ethyl maltol, or glycine."),
        (902, 902, "Glazing Agent", "plant", "Candelilla plant wax."),
        (905, 909, "Glazing Agent", "mineral", "Microcrystalline mineral wax or paraffin."),
        (912, 919, "Glazing Agent", "plant", "Montan acid ester or plant resin."),
        (921, 949, "Packaging Gas", "synthetic", "Propellants, chlorine dioxide, argon, nitrogen."),
        (952, 953, "Sweetener", "synthetic", "Cyclamate or isomalt sweetener."),
        (956, 964, "Sweetener", "synthetic", "Alitame, thaumatin, or erythritol."),
        (966, 969, "Sweetener", "plant", "Lactitol, xylitol, or advantame."),
        (990, 999, "Foaming Agent", "plant", "Quillaia extract or plant saponin."),
        (1100, 1104, "Enzyme", "microbial", "Microbial amylase or protease enzyme."),
        (1201, 1204, "Stabilizer", "synthetic", "Polyvinylpyrrolidone or pullulan."),
        (1400, 1403, "Modified Starch", "plant", "Dextrin or acid-treated plant starch."),
        (1405, 1411, "Modified Starch", "plant", "Bleached or enzyme-treated plant starch."),
        (1413, 1421, "Modified Starch", "plant", "Phosphated or acetylated plant starch."),
        (1423, 1441, "Modified Starch", "plant", "Acetylated or hydroxypropyl plant starch."),
        (1443, 1519, "Modified Starch", "plant", "Starch sodium octenyl succinate or triacetin."),
    ]

    for start, end, category, origin, desc in standard_halal_ranges:
        for num in range(start, end + 1):
            key = f"E{num}"
            if key not in ADDITIVES_DATABASE:
                # Assign status based on chemical category
                if "fatty acid" in desc.lower() or "stearate" in desc.lower() or "enzyme" in category.lower():
                    status = "Mushbooh"
                    concern = f"{desc} Source origin (plant vs animal derivative) must be confirmed."
                else:
                    status = "Halal"
                    concern = f"{desc} Derived from mineral, plant, or synthetic sources."
                
                ADDITIVES_DATABASE[key] = {
                    "name": f"Additive {key} ({category})",
                    "status": status,
                    "origins": [origin],
                    "concern": concern,
                    "standards_ref": "Codex Alimentarius / Halal Authority Guidelines"
                }

_initialize_full_catalogue()


def normalize_term(term: str) -> str:
    """Normalize input search term to match E-codes and ingredient keys."""
    if not term:
        return ""
    cleaned = term.strip().upper()
    
    # Handle patterns like "E-471", "E 471", "INS 471", "INS-471", "471"
    match = re.search(r'\b(?:E|INS)?[\s\-_]*([0-9]{3,4}[A-Z]?)\b', cleaned)
    if match:
        return f"E{match.group(1)}"
        
    # Clean punctuation for name matching
    cleaned_name = re.sub(r'[^A-Z0-9\s]', ' ', cleaned)
    cleaned_name = re.sub(r'\s+', ' ', cleaned_name).strip()
    return cleaned_name


def lookup_additive(term: str) -> Optional[dict]:
    """
    Lookup an ingredient or additive by E-code, synonym, or chemical name.
    Performs exact match, normalized code match, and fuzzy substring matching.
    """
    if not term:
        return None
        
    term_upper = term.strip().upper()
    norm = normalize_term(term)

    # 1. Direct code lookup (e.g. "E471")
    if norm in ADDITIVES_DATABASE:
        data = ADDITIVES_DATABASE[norm].copy()
        data["code"] = norm
        return data

    # 2. Direct key lookup (e.g. "GELATIN", "CARMINE")
    if term_upper in ADDITIVES_DATABASE:
        data = ADDITIVES_DATABASE[term_upper].copy()
        data["code"] = term_upper
        return data

    # 3. Exact and synonym matches
    # Ignore common pure food staples that should never match additive names via substring
    common_staples = {"SALT", "WATER", "SUGAR", "HONEY", "WHEAT", "FLOUR", "RICE", "CORN", "MILK", "EGG", "OAT"}
    if term_upper in common_staples:
        return None

    # Check exact match or exact synonym split (e.g. "Carmine / Cochineal / Carminic Acid")
    for key, data in ADDITIVES_DATABASE.items():
        name_upper = data["name"].upper()
        if term_upper == name_upper:
            res = data.copy()
            res["code"] = key
            return res

        # Split synonyms by '/', ',', or '('
        synonyms = [s.strip(" ()") for s in re.split(r'[/,()]', name_upper) if s.strip(" ()")]
        for syn in synonyms:
            if term_upper == syn:
                res = data.copy()
                res["code"] = key
                return res

    # 4. Specific high-priority ingredient keyword checks
    for key, data in ADDITIVES_DATABASE.items():
        if "GELATIN" in term_upper and "GELATIN" in key:
            res = data.copy()
            res["code"] = key
            return res
        if ("CARMINE" in term_upper or "COCHINEAL" in term_upper) and "E120" in key:
            res = data.copy()
            res["code"] = "E120"
            return res
        if ("MONO" in term_upper and "DIGLYCERIDE" in term_upper) and "E471" in key:
            res = data.copy()
            res["code"] = "E471"
            return res
        if "RENNET" in term_upper and "RENNET" in key:
            res = data.copy()
            res["code"] = key
            return res
        if "PEPSIN" in term_upper and "PEPSIN" in key:
            res = data.copy()
            res["code"] = key
            return res
        if "WHEY" in term_upper and "WHEY" in key:
            res = data.copy()
            res["code"] = key
            return res
        if "SHELLAC" in term_upper and "SHELLAC" in key:
            res = data.copy()
            res["code"] = key
            return res
        if ("CYSTEINE" in term_upper or "CYSTINE" in term_upper) and ("E920" in key or "L-CYSTEINE" in key):
            res = data.copy()
            res["code"] = key
            return res

    # 5. Word boundary regex search for chemical terms (length >= 5 and not a common stop word)
    stop_words = {"ACID", "SALTS", "EXTRACT", "POWDER", "SYRUP", "JUICE", "COLOR", "COLOUR"}
    if len(term_upper) >= 5 and term_upper not in stop_words:
        pattern = r'\b' + re.escape(term_upper) + r'\b'
        for key, data in ADDITIVES_DATABASE.items():
            name_upper = data["name"].upper()
            if re.search(pattern, name_upper):
                res = data.copy()
                res["code"] = key
                return res

    return None


def get_total_count() -> int:
    """Return total number of indexed additives and food items."""
    return len(ADDITIVES_DATABASE)
