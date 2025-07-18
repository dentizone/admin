import { Component, OnInit } from '@angular/core';
import { CatalogService } from '../catalog-service';
import { CommonModule } from '@angular/common';
import { ToastComponent } from "../../../shared/components/toast-component/toast-component";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-catalog-management',
  imports: [CommonModule,FormsModule, ToastComponent],
  templateUrl: './catalog-management.html',
  styleUrl: './catalog-management.css'
})
export class CatalogManagement implements OnInit{

  viewToast=false;
  newCategory={
    name:'',
    iconUrl:'/assets/images/image-gallery.png'
  };
  isToastSuccess=true;
  isAddCategoryShow=false;
  toastMessage='';
  newCategoryName='';
  selectedCategory={
    iconUrl:'',
    id:'',
    name:''
  }
categories=[{
    iconUrl:'',
    id:'',
    name:''
  }]
  subCategory=[{
    category:{
      id:'',
      name:''
    } ,
    id: "",
    name: "Choose Category"
  }]
  isEditShown=false;
  subCategoryAddShow=false;
  newSubCategoryName='';
  newUrl=''
  handelSubcategoryadd(){
    this.subCategoryAddShow=!this.subCategoryAddShow;
  }
  handelAddCategory(){
    this.isAddCategoryShow=!this.isAddCategoryShow;
  }
  constructor(private readonly catalogService:CatalogService){}

  removeCategory(categoryID:string){
    this.catalogService.removeCategory(categoryID).subscribe({
      next:data=>{
        this.isEditShown=false;
        this.toastMessage='Category Removed Successfully';
        this.showToast();
        
        this.getCategories();
      },
      error:err=>{
        this.isEditShown=false;
        this.isToastSuccess=false;
        this.toastMessage='Failed to remove Category'
        this.showToast()
      }
    })
  }
  onBackdropClick(event: MouseEvent) {
    this.isEditShown = false;
    this.subCategoryAddShow=false;
    this.isAddCategoryShow=false;
    this.newCategoryName='';
    this.newSubCategoryName='';
  }
  showEdit(index?:number){
    this.isEditShown=!this.isEditShown;

    if(index!=undefined){
      this.selectedCategory=this.categories[index];
    }
  }
  
  ngOnInit(): void {
    this.getCategories();
  }
  getCategories(){
    this.catalogService.getAllCategories().subscribe({
      next:data=>{
        this.categories=data;
      },
      error:err=>{
        console.log(err);
      }
    })
  }
  showToast(){
    this.viewToast=true;
    setTimeout(() => {
        this.viewToast = false;
        this.toastMessage='';
        this.isToastSuccess=true;
      }, 2000);
  }
  addSubCategory(){
    this.catalogService.addSubcategory(this.selectedCategory.id,this.newSubCategoryName).subscribe({
      next:data=>{
        this.toastMessage='Subcategory Added Successfully';
        this.showToast();
        this.getSubcategory(this.selectedCategory.id);
        this.newSubCategoryName=''
      },
      error:err=>{
        this.isToastSuccess=false;
        this.toastMessage='Add Subcategory Failed'
        this.showToast()
        this.newSubCategoryName=''
      }
    })
    this.handelSubcategoryadd();

  }
  addCategory(){
    if(this.newCategory.name && this.newCategory.iconUrl!='/assets/images/image-gallery.png' ){
    this.catalogService.addNewCategory(this.newCategory.name,this.newCategory.iconUrl).subscribe({
      next:data=>{
        
        this.toastMessage='Category Added Successfully';
        this.showToast();
        this.newCategory.iconUrl='/assets/images/image-gallery.png';
        this.newCategory.name='';
        this.handelAddCategory();
        this.getCategories();
      },
      error:err=>{
        this.isToastSuccess=false;
        this.toastMessage='Failed to add category'
        this.showToast()
      }
    })
  }
  else{
    this.isToastSuccess=false;
    this.toastMessage='Failed please enter valid name and imag'
    this.showToast()
  }
  }
  UpdateCategory(categoryID:string){
    let url;
    let name;
    if(this.newUrl!=''){
      url=this.newUrl;
    }else{
      url=this.selectedCategory.iconUrl
    }
    if(this.newCategoryName!=''){
      name=this.newCategoryName;
    }else{
      name=this.selectedCategory.name
    }
    this.catalogService.updateCategoryData(url,name,categoryID).subscribe({
      next:data=>{
        this.toastMessage='Category Updated Successfully';
        this.newUrl='';
        this.isEditShown = false;
        this.showToast();
        this.getCategories();
      },
      error:err=>{
        this.isToastSuccess=false;
        this.toastMessage='Faled to update category'
        this.isEditShown = false;
        this.showToast()
        console.log('icon url: ',url,' New name ',this.newCategoryName,'  id:',categoryID)
      }
    })

  }
  removeSubcategory(id:string){
    this.catalogService.removeSubcategory(id).subscribe({
      next:data=>{
        this.toastMessage='Subcategory Removed Successfully';
        this.isEditShown = false;
        this.showToast();

        this.getSubcategory(this.selectedCategory.id);
      },
      error:err=>{
        this.isToastSuccess=false;
        this.toastMessage='Faled to remove Subcategory'
        this.isEditShown = false;
        this.showToast()
      }
    })
  }
  getSubcategory(id:string,index?:number){
    if(index!=undefined){
      this.selectedCategory=this.categories[index];
      
    }
    this.catalogService.getSubCategories(id).subscribe({
      next:data=>{
        this.subCategory=data
        console.log(data)
      },error:err=>{
        console.log(err);
      }
    })
  }
  onImageUpload(event: Event): void {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = () => {
    this.newCategory.iconUrl= reader.result as string;
    this.catalogService.uploadImage(file).subscribe({
    next: (res: any) => {
      console.log('Image uploaded successfully', res);
      this.newCategory.iconUrl = res.url.startsWith('http') 
      ? res.url 
      : `https://apit.gitnasr.com/${res.url}`;
      this.toastMessage='Icon Changed Successfully';
      this.showToast();
    },
    error: err => {
      console.error('Failed to upload image', err);
      this.isToastSuccess=false;
        this.toastMessage='Faled to update category'
        this.showToast()
    }
  });
  };

  reader.readAsDataURL(file);
  }
  onImageChange(event: Event): void {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = () => {
    this.selectedCategory.iconUrl = reader.result as string;
    this.catalogService.uploadImage(file).subscribe({
    next: (res: any) => {
      console.log('Image uploaded successfully', res);
      this.newUrl=res.url;
      this.toastMessage='Icon Changed Successfully';
      this.showToast();
    },
    error: err => {
      console.error('Failed to upload image', err);
      this.isToastSuccess=false;
        this.toastMessage='Faled to update category'
        this.showToast()
    }
  });
  };

  reader.readAsDataURL(file);
  }

}
