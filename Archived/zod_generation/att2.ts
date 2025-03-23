import * as schemas from "./schemas";
import fs from "fs";
import { createTypeAlias, zodToTs } from 'zod-to-ts'
import ts from "typescript";


let output = "";

for (const [key, schema] of Object.entries(schemas)) {
    const { node } = zodToTs(schema, key);
    const typeAlias = createTypeAlias(node, key);

    
    const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
    const typeAliasString = printer.printNode(
        ts.EmitHint.Unspecified,
        typeAlias,
        ts.createSourceFile("", "", ts.ScriptTarget.ESNext)
    );

    output += `${typeAliasString}\n\n`;
}

fs.writeFileSync("TypeSchemas.ts", output);