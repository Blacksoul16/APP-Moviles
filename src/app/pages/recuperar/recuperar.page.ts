import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NivelEducacional } from 'src/app/model/nivel-educacional';
import { Usuario } from 'src/app/model/usuario';
import { ToastService } from '../servicios/toast.service';

@Component({
  selector: 'app-recuperar',
  templateUrl: './recuperar.page.html',
  styleUrls: ['./recuperar.page.scss'],
})
export class RecuperarPage implements OnInit {
  public correo: string="";
  public tab: string="validarCorreo";
  public usuario: Usuario
  public respuestaSecreta: string=""

  constructor(private router: Router, private toastservice: ToastService) { 
    this.usuario= new Usuario("","","","","","","",NivelEducacional.findNivelEducacional(1)!,undefined)
  }

  ngOnInit() {
  }

  public validarCorreo(): void{
    const usuario=new Usuario("","","","","","","",NivelEducacional.findNivelEducacional(1)!,undefined)
    const usuarioEncontrado=usuario.buscarUsuarioPorCorreo(this.correo)
    if(usuarioEncontrado){
      this.seleccionarTab("validarPreguntaSecreta")
      this.usuario=usuarioEncontrado
    }
    else{
      this.toastservice.showMsg("Usuario no encontrado.",1500,"danger")
    }
  }

  public seleccionarTab(tab: string): void{
    this.tab=tab
  }

  public validarRespuesta(): void{
    if(this.respuestaSecreta===this.usuario.respuestaSecreta){
      this.toastservice.showMsg("Respuesta correcta",1500,"success")
    }
    else{
      this.toastservice.showMsg("Respuesta incorrecta.",1500,"danger")
    }
  }
}
