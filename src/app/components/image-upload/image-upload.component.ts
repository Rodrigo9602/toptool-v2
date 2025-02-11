import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Image } from '../../interfaces/order';

@Component({
  selector: 'app-image-upload',
  imports: [CommonModule],
  templateUrl: './image-upload.component.html',
  styleUrl: './image-upload.component.scss',
})
export class ImageUploadComponent {
  @Input() maxFiles: number = 3;
  @Input() maxFileSize: number = 8 * 1024 * 1024; // 8MB default
  @Output() imagesChange = new EventEmitter<Image[]>();
  @Input() images: Image[] = [];  
  dragOver = false;

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.dragOver = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.dragOver = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.dragOver = false;

    const files = event.dataTransfer?.files;
    if (files) {
      this.handleFiles(Array.from(files));
    }
  }

  onFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.handleFiles(Array.from(input.files));
    }
  }

  private handleFiles(files: File[]) {
    if (this.images.length + files.length > this.maxFiles) {
      console.error(`Maximum ${this.maxFiles} files allowed`);
      return;
    }

    files.forEach((file) => {
      if (!file.type.startsWith('image/')) {
        console.error('Only image files are allowed');
        return;
      }

      if (file.size > this.maxFileSize) {
        console.error('File size exceeds limit');
        return;
      }

      const newImage: Image = {
        fileName: file.name,
        fileSize: file.size,
        lastModified: file.lastModified,
        fileUrl: URL.createObjectURL(file),
      };

      this.images.push(newImage);
    });

    this.imagesChange.emit(this.images);
  }

  removeImage(index: number) {
    URL.revokeObjectURL(this.images[index].fileUrl);
    this.images.splice(index, 1);
    this.imagesChange.emit(this.images);
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}
