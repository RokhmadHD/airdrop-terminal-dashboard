// src/contexts/ConfirmationDialogProvider.tsx

"use client";

import { createContext, useContext, useState, ReactNode, useCallback } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

// Definisikan tipe untuk opsi dialog
interface DialogOptions {
  title: string;
  description: ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void | Promise<void>;
}

// Definisikan tipe untuk context value
interface ConfirmationDialogContextType {
  showDialog: (options: DialogOptions) => void;
}

// Buat context
const ConfirmationDialogContext = createContext<ConfirmationDialogContextType | undefined>(undefined);

// Komponen Provider
export const ConfirmationDialogProvider = ({ children }: { children: ReactNode }) => {
  const [options, setOptions] = useState<DialogOptions | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const showDialog = useCallback((opts: DialogOptions) => {
    setOptions(opts);
    setIsOpen(true);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    // Beri sedikit jeda sebelum membersihkan options agar transisi keluar mulus
    setTimeout(() => {
      setOptions(null);
    }, 150);
  };

  const handleConfirm = async () => {
    if (options?.onConfirm) {
      await options.onConfirm();
    }
    handleClose();
  };

  return (
    <ConfirmationDialogContext.Provider value={{ showDialog }}>
      {children}
      
      {/* Render komponen AlertDialog secara global */}
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          {options && (
            <>
              <AlertDialogHeader>
                <AlertDialogTitle>{options.title}</AlertDialogTitle>
                <AlertDialogDescription>{options.description}</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={handleClose}>
                  {options.cancelText || "Cancel"}
                </AlertDialogCancel>
                {/* Kita gunakan Button biasa untuk onConfirm agar bisa menangani state loading */}
                <Button onClick={handleConfirm}>
                  {options.confirmText || "Confirm"}
                </Button>
              </AlertDialogFooter>
            </>
          )}
        </AlertDialogContent>
      </AlertDialog>
    </ConfirmationDialogContext.Provider>
  );
};

// Custom Hook untuk menggunakan dialog
export const useConfirmationDialog = () => {
  const context = useContext(ConfirmationDialogContext);
  if (!context) {
    throw new Error("useConfirmationDialog must be used within a ConfirmationDialogProvider");
  }
  return context;
};