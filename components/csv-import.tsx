"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { parseCSV, csvRowsToTasks, generateSampleCSV, type CSVRow } from "@/lib/csv-processor"
import type { Task } from "@/lib/types"
import { Upload, Download, FileText, AlertCircle, CheckCircle } from "lucide-react"

interface CSVImportProps {
  onImport: (tasks: Task[]) => void
}

export function CSVImport({ onImport }: CSVImportProps) {
  const [csvData, setCsvData] = useState<CSVRow[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null)

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.name.toLowerCase().endsWith(".csv")) {
      setError("Por favor, selecione um arquivo CSV válido")
      return
    }

    setIsProcessing(true)
    setError(null)
    setFileName(file.name)

    try {
      const content = await file.text()
      const parsedData = parseCSV(content)

      if (parsedData.length === 0) {
        throw new Error("Nenhum dado válido encontrado no arquivo CSV")
      }

      setCsvData(parsedData)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao processar arquivo CSV")
      setCsvData([])
    } finally {
      setIsProcessing(false)
    }
  }

  const handleImport = () => {
    if (csvData.length === 0) return

    const tasks = csvRowsToTasks(csvData)
    onImport(tasks)

    // Limpar dados após importação
    setCsvData([])
    setFileName(null)
    setError(null)
  }

  const handleDownloadSample = () => {
    const csvContent = generateSampleCSV()
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")

    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute("href", url)
      link.setAttribute("download", "exemplo-user-stories.csv")
      link.style.visibility = "hidden"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "feature":
        return "bg-blue-100 text-blue-800"
      case "bug":
        return "bg-red-100 text-red-800"
      case "refactor":
        return "bg-yellow-100 text-yellow-800"
      case "documentation":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Importar User Stories via CSV
          </CardTitle>
          <CardDescription>
            Carregue suas user stories a partir de um arquivo CSV para acelerar o processo de estimativa.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="csv-file">Arquivo CSV</Label>
            <Input id="csv-file" type="file" accept=".csv" onChange={handleFileUpload} disabled={isProcessing} />
          </div>

          {isProcessing && (
            <Alert>
              <FileText className="h-4 w-4" />
              <AlertTitle>Processando arquivo...</AlertTitle>
              <AlertDescription>Aguarde enquanto processamos seu arquivo CSV.</AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Erro ao processar arquivo</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex gap-2">
            <Button variant="outline" onClick={handleDownloadSample} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Baixar Exemplo CSV
            </Button>
          </div>

          <div className="text-sm text-slate-600 space-y-2">
            <p>
              <strong>Formato esperado do CSV:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>
                <strong>title:</strong> Título da user story
              </li>
              <li>
                <strong>description:</strong> Descrição detalhada da tarefa
              </li>
              <li>
                <strong>type:</strong> Tipo da tarefa (feature, bug, refactor, documentation)
              </li>
              <li>
                <strong>storyPoints:</strong> Número de story points (1, 2, 3, 5, 8, 13, 21)
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {csvData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Preview dos Dados ({csvData.length} {csvData.length === 1 ? "tarefa" : "tarefas"})
            </CardTitle>
            <CardDescription>Revise os dados antes de importar. {fileName && `Arquivo: ${fileName}`}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="max-h-96 overflow-auto border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Título</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Story Points</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {csvData.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium max-w-48">
                        <div className="truncate" title={row.title}>
                          {row.title}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-64">
                        <div className="truncate" title={row.description}>
                          {row.description}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getTypeColor(row.type)}>{row.type}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{row.storyPoints}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex justify-between items-center pt-4">
              <p className="text-sm text-slate-600">
                {csvData.length} {csvData.length === 1 ? "tarefa será importada" : "tarefas serão importadas"}
              </p>
              <Button onClick={handleImport} className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Importar Tarefas
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
