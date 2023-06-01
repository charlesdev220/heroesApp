import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, pipe, switchMap, tap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';


import { Hero, Publisher } from '../../interfaces/hero.interface';
import { HeroesService } from '../../services/heroes.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
import { throwToolbarMixedModesError } from '@angular/material/toolbar';

@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styles: [
  ]
})
export class NewPageComponent implements OnInit {

  // formulario
  public heroForm = new FormGroup({
    id:               new FormControl<string>(''),
    superhero:        new FormControl<string>('' , { nonNullable: false}),
    publisher:        new FormControl<Publisher>(Publisher.DCComics),
    alter_ego :       new FormControl(''),
    first_appearance: new FormControl(''),
    characters:       new FormControl(''),
    alt_img:          new FormControl('')
  })


  public publishers = [
    { id: 'DC Comics', desc: 'DC - Comics'},
    { id: 'Marvel Comics', desc: 'Marvel - Comics'},
  ];

  constructor(private heroService: HeroesService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private snackbar: MatSnackBar,
    private dialog: MatDialog){}


  ngOnInit(): void {
    if(!this.router.url.includes('edit')) return ;

    this.activatedRoute.params
      .pipe(
        switchMap( ({id})=> this.heroService.getHeroById(id)),
      ).subscribe(hero => {
        if(!hero) return this.router.navigateByUrl('/');

        //formatea el formulario o resetea valores
        this.heroForm.reset(hero);

        return ;
      })
  }

  get currentHero(): Hero {
    const hero = this.heroForm.value as Hero;

    return hero;
  }

  onSubmit(): void {

    if(this.heroForm.invalid) return;
    console.log('0');
    if(this.currentHero.id){
      this.heroService.updateHero(this.currentHero)
      .subscribe(hero => {
        console.log('1');
        this.showSnackbar(`${hero.superhero} updated!`)
      });

      return;
    }

    this.heroService.addHero(this.currentHero)
    .subscribe(hero => {
      console.log('2');
      this.router.navigate(['/heroes/edit', hero.id]);
      this.showSnackbar(`${hero.superhero} created`);
    });
  }

  onDeleteHero(){
    if( !this.currentHero.id ) throw Error('Error no id ');

    //openDialog(): void {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: this.heroForm.value,
      });


      dialogRef.afterClosed()
        .pipe(
          filter( (result: boolean) => result ), //si es true.. lo dejo pasar
          switchMap( () => this.heroService.deleteHeroById(this.currentHero.id)),
          filter((wasDeleted: boolean) => wasDeleted),
        )
        .subscribe( () => {this.router.navigate(['/heroes']);
      });
  }

  showSnackbar(message: string ): void {
    this.snackbar.open(message, 'done',
    { duration: 2500});
  }
}
