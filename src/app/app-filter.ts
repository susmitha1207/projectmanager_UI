import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'listFilter'
})
export class ListFilter implements PipeTransform {
filteredItems:any[];
  transform(items: any[], searchText: string): any[] {
    if(!items) return [];
    if(!searchText) return items;
searchText = searchText.toLowerCase();
this.filteredItems= items.filter( it => {
    if(it.firstName){
      return it.firstName.toLowerCase().includes(searchText);
    }else if(it.project){
      if(it.project.project){
        return it.project.project.toLowerCase().includes(searchText);
      }
      else if(it.project.toLowerCase()){
        return it.project.toLowerCase().includes(searchText);
      }
      
    }
    });
    return this.filteredItems;
   }

}