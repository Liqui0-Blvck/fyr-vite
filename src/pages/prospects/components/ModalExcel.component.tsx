import React, { FC, useState } from 'react'
import Modal, { ModalBody, ModalHeader } from '../../../components/ui/Modal'
import { useDropzone } from 'react-dropzone'
import Progress from '../../../components/ui/Progress'
import Icon from '../../../components/icon/Icon'
import Button from '../../../components/ui/Button'
import ExcelJS from 'exceljs'
import { Prospect } from '../../../types/app/Prospect.type'
import { useAppDispatch, useAppSelector } from '../../../store/hook'
import { addProspectsToFirestore } from '../../../store/slices/prospect/prospectSlice'
import { RootState } from '../../../store/rootReducer'


interface ModalExcelProps {
  openModalMassiveProspect: boolean;
  setOpenModalMassiveProspect: React.Dispatch<React.SetStateAction<boolean>>;
}

interface FileWithProgress extends File {
  progress: number;
}

const ModalExcel: FC<ModalExcelProps> = ({ openModalMassiveProspect, setOpenModalMassiveProspect }) => {
  const [files, setFiles] = useState<FileWithProgress[]>([])
  const [prospectsData, setProspectsData] = useState<any[]>([]) // To store parsed excel data
  const dispatch = useAppDispatch()
  const { successFullProspects, failedProspects } = useAppSelector((state: RootState) => state.prospect)
  const [totalLeads, setTotalLeads] = useState(0);


  // Handle file drop and simulate upload
  const onDrop = (acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map(file => ({ ...file, progress: 0 } as FileWithProgress))
    setFiles(prev => [...prev, ...newFiles])
    simulateUpload(newFiles)
    parseExcelFile(acceptedFiles[0]) // Parse the first dropped file
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
      'application/vnd.ms-excel': ['.xls']
    },
    multiple: false
  })

  // Simulate file upload progress
  const simulateUpload = (filesToUpload: FileWithProgress[]) => {
    filesToUpload.forEach((file, index) => {
      const interval = setInterval(() => {
        setFiles(prevFiles => {
          const newFiles = [...prevFiles]
          if (newFiles[index].progress < 100) {
            newFiles[index] = { ...newFiles[index], progress: newFiles[index].progress + 10 }
          } else {
            clearInterval(interval)
          }
          return newFiles
        })
      }, 500)
    })
  }

  // Parse the Excel file using ExcelJS
  const parseExcelFile = (file: File) => {
    const reader = new FileReader()
    reader.onload = async (e) => {
      const workbook = new ExcelJS.Workbook()
      await workbook.xlsx.load(e.target?.result as ArrayBuffer)

      const worksheet = workbook.worksheets[0] // Assuming we are working with the first sheet

      const rows: Prospect[] = []
      worksheet.eachRow((row, rowNumber) => {
        // Assuming the first row is the header and rows 2+ contain the actual data
        if (rowNumber > 1) {
          const name = row.getCell(1)?.text.toLowerCase() || ''
          const email = row.getCell(2)?.text.toLowerCase() || ''
          const phoneNumber = row.getCell(3)?.text || ''

          // Create a Prospect object from each row
          rows.push({ name, email, phoneNumber })
        }
      })

      console.log(rows)

      

      setTotalLeads(rows.length)

      // Store the parsed data
      setProspectsData(rows)
      await dispatch(addProspectsToFirestore(rows))

    }
    reader.readAsArrayBuffer(file) // Read file as ArrayBuffer
  }

  // Remove file from the list
  const removeFile = (fileToRemove: File) => {
    setFiles(files.filter(file => file !== fileToRemove))
  }

  // Format file size for display
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const processedPercentage = totalLeads > 0 ? (successFullProspects + failedProspects) * 100 / totalLeads : 0;

  console.log(processedPercentage)


  return (
    <Modal
      isOpen={openModalMassiveProspect}
      setIsOpen={setOpenModalMassiveProspect}
    >
      <ModalHeader>Upload Excel File</ModalHeader>
      <ModalBody>
        <div className="grid gap-4 py-4">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${isDragActive ? "border-primary bg-primary/10" : "border-gray-300"}`}
          >
            <input {...getInputProps()} />
            <Icon icon="HeroDocument" className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-500">
              {isDragActive ? "Drop the files here" : "Drop your files here, or click to select files"}
            </p>
          </div>
          {files.map((file, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div className="flex-1">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{file.name}</span>
                  <span className="text-gray-500">{formatFileSize(file.size)}</span>
                </div>
                <Progress 
                  value={processedPercentage} 
                  className="h-2 mt-1" />
              </div>
              <Button variant="solid" icon="HeroXMark" onClick={() => removeFile(file)} />
            </div>
          ))}
        </div>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => setOpenModalMassiveProspect(false)}>
            Cancel
          </Button>
          <Button
            isDisable={files.length === 0 || files.some(file => file.progress < 100)}
            onClick={() => { 
              setFiles([])
              setOpenModalMassiveProspect(false)
             }}
          >
            Continue
          </Button>
        </div>
      </ModalBody>
    </Modal>
  )
}

export default ModalExcel
