<?php

// use Illuminate\Http\Request;
// Route::middleware('auth:api')->get('/user', function (Request $request) {
//     return $request->user();
// });
Route::post('saveImg','UserController@savePhoto');
Route::post('login', 'APIController@login');
Route::post('register', 'APIController@register');
Route::post('/forgot-password', 'APIController@sendEmail');
Route::post('/change-password/{id}', 'APIController@changePasswordJs');
Route::get('products' , 'ProductsController@getProducts');
Route::group(['middleware' => 'auth.jwt'], function () {
    // Auth
    Route::post('logout', 'APIController@logout');
    Route::get('refresh', 'APIController@refresh');
    Route::post('me', 'APIController@me');

    // User
    Route::put('user/update/{id}', 'UserController@update');
    Route::post('user/upload/photos', 'UserController@uploadPhotos');
    Route::post('setImgProfile', 'UserController@updatePhoto');
    Route::get('img/zone', 'UserController@imagesZone');
    Route::get('user', 'UserController@getUser');
    Route::get('delete-photo', 'UserController@deletePhoto');

    // Hiatory

    // Hiatory

    Route::get('history','HistoryController@index');

    // Reservation
    Route::resource('/reservation', 'ReservationController');
    Route::post('/reservations', 'ReservationController@storeReservations');
    // Comments
    Route::post('/commentary', 'CommentaryController@comment');
    Route::get('blog/like/{blog}', 'BlogController@like');
    Route::get('blog/likes/{id}', 'BlogController@likes');

    // BeforeAfter
    Route::get('/before-after', 'BeforeAfterController@getCases');
    Route::post('/before-after', 'BeforeAfterController@saveData');
    Route::get('/clients', 'BeforeAfterController@getClients');

    // Examples
    Route::get('tasks', 'TaskController@index');
    Route::get('tasks/{id}', 'TaskController@show');
    Route::post('tasks', 'TaskController@store');
    Route::put('tasks/{id}', 'TaskController@update');
    Route::delete('tasks/{id}', 'TaskController@destroy');


});

Route::get('plans', 'PlansController@index');
Route::post('plan', 'PlansController@store');

Route::get('procedures', 'ProceduresController@index');
Route::post('procedure', 'ProceduresController@store');

// Room
Route::resource('/room','RoomsController');
Route::get('room/{id}', 'RoomsController@show');
Route::get('rooms', 'RoomsController@index');
Route::post('room', 'RoomsController@store');

Route::get('roomstype', 'RoomsTypeController@index');

Route::get('reversations', 'ReservationController@index');

Route::get('products', 'APIController@getProductService');

//  Blog
Route::resource('blog', 'BlogController');
Route::get('blog/posts/{option}/{id?}', 'BlogController@index');
Route::get('blog/user/{id}', 'BlogController@getForUser');
Route::post('blog/report/{id?}', 'BlogController@report');
Route::post('blog/block', 'BlogController@block');
Route::post('blog/delete/{id?}', 'BlogController@delete');
Route::get('blog/reportuser/{id}/{iduser}', 'BlogController@getReportUser');
