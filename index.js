/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$(document).ready(function (){

    var btn_guardar, camp_ip, MV, MDZ, ZV;
    
    error = 'No hay una tarea para guardar';
    
    cam_ip = $("#camip");
    MV = $("#movementRange");
    MDZ = $("#movemetDZRange");
    ZV = $("#zoomRange");
    ZDZ = $("#zoomDZRange");
    btn_guardar = $('#save_button'); 
    
    axis.Tabla();
    var test = axis.Consultar();
    console.log(test);
    
    btn_guardar.on('click', function (){
        
        if(cam_ip.val() === ''){ 
            alert('Camera IP field must not be empty!.');
            return;
        }else{
            axis.Insertar(cam_ip.val(),MV.val(),MDZ.val(),ZV.val(),ZDZ.val());
            alert('Camera added sussesfully.');
        }
        
    });
    
    $(document).on('click', '#lista button', function(){
         
         var fila;
         
         fila = $(this).data('fila');         
         
         axis.Eliminar(fila);
         
     }); 
    
    
});


var axis = new AXIS();

function AXIS (){};
    
AXIS.prototype.CrearDB = function (){

    var nombrecorto = 'DB Axis';
    var version = '1.0';
    var nombrebase = 'Axis Web DB';
    var size = 50*1024*1024;    

    var db = openDatabase(nombrecorto, version, nombrebase, size);
    return db;

};

AXIS.prototype.Tabla = function (){

    var db, SqlLista;

    db = axis.CrearDB();
    SqlLista = 'CREATE TABLE IF NOT EXISTS Axis_values(fila integer primary key, camip text, m_value integer,mdz_value float,z_value integer,zdz_value float)';

    db.transaction(function (tx){

        tx.executeSql(SqlLista);

    });

};

AXIS.prototype.Insertar = function (camip, m_value, mdz_value, z_value, zdz_value){

    var db, SqlInsert, SqlConsulta, cantidad, cero, fila, mensaje, success, contador;

    db = axis.CrearDB();
    SqlInsert = 'INSERT INTO Axis_values(fila, camip, m_value, mdz_value, z_value, zdz_value) VALUES(?,?,?,?,?,?)';
    SqlConsulta = 'SELECT * FROM Axis_values';
    mensaje = $("#mensaje");
    success = 'Success!';
    contador = $("#contador");
    cero = 0;    

    db.transaction(function (tx){

        tx.executeSql(SqlConsulta, [], function (tx, results){

            cantidad = results.rows.length;
            
            if(cantidad === cero){
                fila = cantidad + 1;
                tx.executeSql(SqlInsert,[fila,camip, m_value, mdz_value, z_value, zdz_value]);
                mensaje.empty();
                mensaje.append(success);
                var cero = 0;
                contador.html(cero);
            }else{
                fila = cantidad + 1;
                tx.executeSql(SqlInsert,[fila,camip, m_value, mdz_value, z_value, zdz_value]);
                mensaje.append(success);
                var cero = 0;
                contador.html(cero);
            }

        });
        axis.Consultar();
    });
    

};

AXIS.prototype.Consultar = function (){
    var db, SqlConsulta, cantidad, cero, lista_tareas, i, html, task, error, mensaje;

    db = axis.CrearDB();
    SqlConsulta = 'SELECT * FROM Axis_values';
    lista_tareas = $('#lista');
    mensaje = $("#mensaje");
    error = 'No hay una tarea para guardar';
    cero = 0;   

    db.transaction(function (tx){
        
        tx.executeSql(SqlConsulta, [], function (tx, results){
            
            cantidad = results.rows.length;
            
            if(cantidad === 0){
                
                 // lista_tareas.empty();
                
                 // html = '<tr>';
                 // html += '<td class="row">';
                 // html += '<div class="col s10">No hay Tareas</div>';                 
                 // html += '</td>';
                 // html += '</tr>';
                
                 //  lista_tareas.append(html);
                
            }else{
                lista_tareas.empty();
                
                 for(i=0; i<cantidad; i++){

                    task = results.rows.item(i);
                    return task.camip;
                    //console.log(task.camip);
                    $("#camip").append(html);
                //      html = '<tr>';
                //      html += '<td class="row">';
                //      html += '<div class="col s10">'+ task.tarea +' - '+task.placa+'</div>';
                //      html += '<button class="col s2 btn-flat" data-fila="'+ task.fila +'">';
                //      html += '<i class="fa fa-times fa-lg"></i>';
                //      html += '</button>';
                //      html += '</td>';
                //      html += '</tr>';

                //      lista_tareas.append(html);

                 }
            }
            
            
            
        });
        
    });
    
};

AXIS.prototype.Eliminar = function (fila){
             
     var db, sqlDelete, mensaje, eliminado;
     //console.log(fila);

     db = tareas.CrearDB();
     sqlDelete = 'DELETE FROM Axis_values WHERE fila = ?';
     mensaje = $("#mensaje");
     eliminado = 'Tarea eliminada';

     db.transaction(function(tx){
         
             tx.executeSql(sqlDelete, [fila]);
             mensaje.append(eliminado);
             tareas.Consultar();
        
     });
 };
    


