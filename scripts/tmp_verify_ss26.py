import csv
import json
import subprocess
import sys
from collections import defaultdict


def main() -> int:
    csv_path = "docs/import-stone-ss26-page1-to-7.csv"
    by_ref_sizes: dict[str, set[str]] = defaultdict(set)

    with open(csv_path, newline="") as f:
        reader = csv.DictReader(f, delimiter=";")
        for row in reader:
            ref = (row.get("reference") or "").strip()
            if not ref:
                continue
            parts = ref.rsplit(" ", 1)
            base = parts[0] if len(parts) > 1 else ref
            size = parts[1] if len(parts) > 1 else ""
            by_ref_sizes[base].add(size)

    errors: list[str] = []

    def run_cmd(args: list[str]) -> tuple[int, str, str]:
        proc = subprocess.run(args, capture_output=True, text=True)
        return proc.returncode, proc.stdout.strip(), proc.stderr.strip()

    for base_ref in sorted(by_ref_sizes.keys()):
        sizes_csv = by_ref_sizes[base_ref]
        code, out, err = run_cmd(
            ["./rcli", "db", "variant-list", "--ref", base_ref, "--json"]
        )
        if code != 0:
            errors.append(
                f"{base_ref}: commande variant-list EC={code}, err={err or out}"
            )
            continue
        try:
            variants = json.loads(out)
        except Exception as exc:  # pragma: no cover - diagnostic only
            errors.append(
                f"{base_ref}: JSON invalide variant-list: {exc}; out={out[:200]}"
            )
            continue

        if not isinstance(variants, list) or not variants:
            errors.append(f"{base_ref}: aucun variant en base")
            continue

        sizes_db = {str(v.get("size") or "") for v in variants}
        if sizes_db != sizes_csv:
            errors.append(
                f"{base_ref}: tailles mismatch CSV={sorted(sizes_csv)} "
                f"DB={sorted(sizes_db)}"
            )

    if errors:
        print(f"❌ MISMATCHES: {len(errors)}")
        for e in errors:
            print("-", e)
        return 1

    print(
        f"✅ Toutes les références OK : {len(by_ref_sizes)} produits "
        f"vérifiés (tailles CSV vs DB)."
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

